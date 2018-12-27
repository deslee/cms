using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Input;
using Content.GraphQL.Models.Result;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Content.GraphQL.Services
{
    public interface IPostService
    {
        Task<MutationResult<Post>> UpsertPost(PostInput postInput, UserContext userContext, string siteId);
        Task<IList<Post>> GetPosts(string siteId);
        Task<Post> GetPost(string postId);
    }

    public class PostService : IPostService
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;
        private readonly ILogger<PostService> logger;

        public PostService(DataContext dataContext, IMapper mapper, ILogger<PostService> logger)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<Post> GetPost(string postId)
        {
            return await dataContext.Posts
                .FirstOrDefaultAsync(s => s.Id == postId);
        }

        public async Task<IList<Post>> GetPosts(string siteId)
        {
            return await dataContext.Posts
                .Where(p => EF.Property<string>(p, "SiteId") == siteId)
                .ToListAsync();
        }

        public async Task<MutationResult<Post>> UpsertPost(PostInput postInput, UserContext userContext, string siteId)
        {
            try
            {
                var post = mapper.Map<Post>(postInput);

                // validate authenticated user belogns to site
                var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
                if (!validated)
                {
                    return new MutationResult<Post>
                    {
                        ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                    };
                }

                // set the "SiteId" shadow property
                dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;

                // remove groups in post that are not in payload
                var foundGroupsInPost = await dataContext.PostGroups.Where(pg => pg.PostId == post.Id).ToListAsync();
                var groupsToDeleteFromPost =
                    foundGroupsInPost.Where(fc => post.PostGroups.FirstOrDefault(x => x.GroupId == fc.GroupId) == null).ToList();
                dataContext.PostGroups.RemoveRange(groupsToDeleteFromPost);

                var allGroupsInSite = await dataContext.Groups.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();

                // assign group ids to groups with the same names
                foreach (PostGroup pg in post.PostGroups)
                {
                    var foundGroupInSite = allGroupsInSite.FirstOrDefault(g => g.Name == pg.Group.Name);
                    if (foundGroupInSite != null)
                    {
                        pg.GroupId = foundGroupInSite.Id;
                        pg.Group.Id = foundGroupInSite.Id;
                    }
                    dataContext.Entry(pg.Group).Property("SiteId").CurrentValue = siteId;
                }

                // remove groups from site that no longer have posts
                foreach (var group in allGroupsInSite)
                {
                    var count = await dataContext.PostGroups.Where(pg => pg.GroupId == group.Id).CountAsync();
                    if (count == 0)
                    {
                        dataContext.Groups.Remove(group);
                    }
                }

                dataContext.Update(post);
                await dataContext.SaveChangesAsync();
                return new MutationResult<Post>
                {
                    Data = post
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured while upserting a post");
                return new MutationResult<Post>
                {
                    ErrorMessage = "An unexpected error occured. Please try again."
                };
            }
        }
    }
}