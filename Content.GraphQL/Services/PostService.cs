using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models.Input;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Services
{
    public interface IPostService
    {
        Task<Post> UpsertPost(PostInput postInput, string siteId);
    }

    public class PostService : IPostService
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public PostService(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
        }

        public async Task<Post> UpsertPost(PostInput postInput, string siteId)
        {
            var post = mapper.Map<Post>(postInput);

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
            return post;
        }
    }
}