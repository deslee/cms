using System;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Content.Data;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Content.GraphQL.Definitions.Types.Input;
using Content.GraphQL.Models.Input;
using AutoMapper;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public ContentMutation(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
            Name = "Mutation";

            Field<SiteType>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: context =>
                {
                    var site = context.GetArgument<Site>("site");
                    return UpsertSite(site);
                }
            );

            FieldAsync<PostType>(
                "upsertPost",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: async context => {
                    var postInput = context.GetArgument<PostInput>("post");
                    var post = mapper.Map<Post>(postInput);
                    var siteId = context.GetArgument<string>("siteId");

                    // set the "SiteId" shadow property
                    dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;

                    // remove the slices that aren't in the payload
                    var slicesInDb = await dataContext.Slices.Where(s => EF.Property<string>(s, "PostId") == post.Id).Select(s => s.Id).ToListAsync();
                    var slicesToDelete = slicesInDb.Where(sid => post.Slices.Where(s => s.Id != null).Any(s => s.Id == sid) == false).ToList();
                    dataContext.Slices.RemoveRange(dataContext.Slices.Where(s => slicesToDelete.Contains(s.Id)));

                    // remove categories in post that are not in payload
                    var foundCategoriesInPost = await dataContext.PostCategories.Where(pc => pc.PostId == post.Id).ToListAsync();
                    var categoriesToDeleteFromPost = 
                        foundCategoriesInPost.Where(fc => post.PostCategories.FirstOrDefault(x => x.CategoryId == fc.CategoryId) == null).ToList();
                    dataContext.PostCategories.RemoveRange(categoriesToDeleteFromPost);
                    
                    // assign category ids to categories with the same names
                    var allCategoriesInSite = await dataContext.Categories.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();
                    foreach(PostCategory pc in post.PostCategories) {
                        var foundCategoryInSite = allCategoriesInSite.FirstOrDefault(c => c.Name == pc.Category.Name);
                        if (foundCategoryInSite != null) {
                            pc.CategoryId = foundCategoryInSite.Id;
                            pc.Category.Id = foundCategoryInSite.Id;
                        }
                        dataContext.Entry(pc.Category).Property("SiteId").CurrentValue = siteId;
                    }

                    dataContext.Update(post);
                    await dataContext.SaveChangesAsync();
                    return post;
                }
            );
        }

        private async Task<Post> UpsertPost(Post post, string siteId)
        {
            dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;
            dataContext.Posts.Update(post);
            await dataContext.SaveChangesAsync();
            return post;
        }

        private async Task<Site> UpsertSite(Site site)
        {
            dataContext.Sites.Update(site);
            await dataContext.SaveChangesAsync();
            return site;
        }
    }
}