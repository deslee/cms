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

            FieldAsync<SiteType>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: async context =>
                {
                    var siteInput = context.GetArgument<SiteInput>("site");
                    var site = mapper.Map<Site>(siteInput);

                    dataContext.Sites.Update(site);
                    await dataContext.SaveChangesAsync();
                    return site;
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

                    // remove groups in post that are not in payload
                    var foundGroupsInPost = await dataContext.PostGroups.Where(pg => pg.PostId == post.Id).ToListAsync();
                    var groupsToDeleteFromPost = 
                        foundGroupsInPost.Where(fc => post.PostGroups.FirstOrDefault(x => x.GroupId == fc.GroupId) == null).ToList();
                    dataContext.PostGroups.RemoveRange(groupsToDeleteFromPost);
                    
                    // assign group ids to groups with the same names
                    var allGroupsInSite = await dataContext.Groups.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();
                    foreach(PostGroup pg in post.PostGroups) {
                        var foundGroupInSite = allGroupsInSite.FirstOrDefault(g => g.Name == pg.Group.Name);
                        if (foundGroupInSite != null) {
                            pg.GroupId = foundGroupInSite.Id;
                            pg.Group.Id = foundGroupInSite.Id;
                        }
                        dataContext.Entry(pg.Group).Property("SiteId").CurrentValue = siteId;
                    }

                    dataContext.Update(post);
                    await dataContext.SaveChangesAsync();
                    return post;
                }
            );
        }
    }
}