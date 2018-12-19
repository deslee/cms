using System;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Content.Data;
using System.Linq;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly DataContext dataContext;

        public ContentMutation(DataContext dataContext)
        {
            this.dataContext = dataContext;
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

            Field<PostType>(
                "upsertPost",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => {
                    var post = context.GetArgument<object>("post");
                    var siteId = context.GetArgument<string>("siteId");
                    return null;
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