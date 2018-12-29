using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
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
        Task<MutationResult<Item>> UpsertPost(PostInput postInput, UserContext userContext, string siteId);
        Task<IList<Item>> GetPosts(string siteId);
        Task<MutationResult> DeletePost(string postId, UserContext userContext);
        Task<Item> GetPost(string postId);
    }

    public class PostService : IPostService
    {
        private readonly DataContext dataContext;
        private readonly ILogger<PostService> logger;
        private readonly IJsonDataResolver jsonDataResolver;

        public PostService(DataContext dataContext, ILogger<PostService> logger, IJsonDataResolver jsonDataResolver)
        {
            this.dataContext = dataContext;
            this.logger = logger;
            this.jsonDataResolver = jsonDataResolver;
        }

        public async Task<MutationResult> DeletePost(string postId, UserContext userContext)
        {
            try
            {
                // find post
                var post = await dataContext.Items.FindAsync(postId);
                if (post == null)
                {
                    return new MutationResult<Site>
                    {
                        ErrorMessage = $"Post {postId} does not exist."
                    };
                }
                var siteId = dataContext.Entry(post).Property("SiteId").CurrentValue as string;

                // validate
                var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
                if (!validated)
                {
                    return new MutationResult<Site>
                    {
                        ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                    };
                }

                // delete
                dataContext.Items.Remove(post);

                await dataContext.SaveChangesAsync();

                return new MutationResult();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured while deleting a post");
                return new MutationResult
                {
                    ErrorMessage = "An unexpected error occured. Please try again."
                };
            }
        }

        public async Task<Item> GetPost(string postId)
        {
            return await dataContext.Items.FindAsync(postId);
        }

        public async Task<IList<Item>> GetPosts(string siteId)
        {
            return await dataContext.Items
                .Where(p => EF.Property<string>(p, "SiteId") == siteId)
                .ToListAsync();
        }

        public async Task<MutationResult<Item>> UpsertPost(PostInput postInput, UserContext userContext, string siteId)
        {
            try
            {
                var item = new Item
                {
                    Id = postInput.Id,
                    Type = "post",
                    Data = jsonDataResolver.Resolve(postInput)
                };
                item.ItemGroups = postInput.Categories?.Select(groupName => new ItemGroup
                {
                    Item = item,
                    ItemId = item.Id,
                    Group = new Group
                    {
                        Name = groupName
                    }
                }).ToList();

                // validate authenticated user belogns to site
                var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
                if (!validated)
                {
                    return new MutationResult<Item>
                    {
                        ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                    };
                }

                // set the "SiteId" shadow property
                dataContext.Entry(item).Property("SiteId").CurrentValue = siteId;

                // remove groups in post that are not in payload
                var foundGroupsInPost = await dataContext.ItemGroups.Where(pg => pg.ItemId == item.Id).ToListAsync();
                var groupsToDeleteFromPost =
                    foundGroupsInPost.Where(fc => item.ItemGroups.FirstOrDefault(x => x.GroupId == fc.GroupId) == null).ToList();
                dataContext.ItemGroups.RemoveRange(groupsToDeleteFromPost);

                var allGroupsInSite = await dataContext.Groups.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();

                // assign group ids to groups with the same names
                foreach (ItemGroup pg in item.ItemGroups)
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
                    var count = await dataContext.ItemGroups.Where(pg => pg.GroupId == group.Id).CountAsync();
                    if (count == 0)
                    {
                        dataContext.Groups.Remove(group);
                    }
                }

                dataContext.Update(item);
                await dataContext.SaveChangesAsync();
                return new MutationResult<Item>
                {
                    Data = item
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured while upserting a post");
                return new MutationResult<Item>
                {
                    ErrorMessage = "An unexpected error occured. Please try again."
                };
            }
        }
    }
}