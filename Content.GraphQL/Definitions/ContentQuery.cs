using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Content.Data;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Content.GraphQL.Services;

namespace Content.GraphQL.Definitions
{
    public class ContentQuery : ObjectGraphType
    {
        private readonly IAuthenticationService authenticationService;
        private readonly DataContext dataContext;
        private readonly ILogger<ContentQuery> logger;

        public ContentQuery(IAuthenticationService authenticationService, DataContext dataContext, ILogger<ContentQuery> logger)
        {
            this.authenticationService = authenticationService;
            this.dataContext = dataContext;
            this.logger = logger;
            Name = "Query";

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => this.GetSites(context)
            );
            Field<SiteType>(
                "site",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<string>("siteId");
                    return this.GetSite(id);
                }
            );
            Field<ListGraphType<PostType>>(
                "posts",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => this.GetPosts(context.GetArgument<string>("siteId"))
            );
            Field<PostType>(
                "post",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "postId" }
                ),
                resolve: context => this.GetPost(context.GetArgument<string>("postId"))
            );
            Field<UserType>(
                "me",
                resolve: context => context.UserContext as User
            );
        }

        private async Task<Site> GetSite(string id)
        {
            logger.LogDebug("Get site called ");
            return await dataContext.Sites
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        private async Task<IList<Site>> GetSites(ResolveFieldContext<object> context)
        {
            return await dataContext.Sites
                .Select(s => new Site
                {
                    Id = s.Id,
                    Name = s.Name,
                    Data = s.Data
                })
                .ToListAsync();
        }

        private async Task<IList<Post>> GetPosts(string siteId) {
            return await dataContext.Posts
                .Where(p => EF.Property<string>(p, "SiteId") == siteId)
                .ToListAsync();
        }

        private async Task<Post> GetPost(string id)
        {
            return await dataContext.Posts
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}