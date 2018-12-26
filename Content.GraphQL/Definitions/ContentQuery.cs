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
using GraphQL.Authorization;
using Content.GraphQL.Models;
using Content.GraphQL.Constants;

namespace Content.GraphQL.Definitions
{
    public class ContentQuery : ObjectGraphType
    {
        private readonly ISiteService siteService;
        private readonly IPostService postService;
        private readonly IUserService userService;

        public ContentQuery(ISiteService siteService, IPostService postService, IUserService userService)
        {
            Name = "Query";
            this.siteService = siteService;
            this.postService = postService;
            this.userService = userService;

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => siteService.GetSites((context.UserContext as UserContext))
            ).AuthorizeWith(Policies.AdminPolicy);
            Field<SiteType>(
                "site",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => siteService.GetSite(context.GetArgument<string>("siteId"))
            );
            Field<ListGraphType<PostType>>(
                "posts",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => postService.GetPosts(context.GetArgument<string>("siteId"))
            );
            Field<PostType>(
                "post",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "postId" }
                ),
                resolve: context => postService.GetPostAsync(context.GetArgument<string>("postId"))
            );
            Field<UserType>(
                "me",
                resolve: context => (context.UserContext as UserContext).AuthenticatedUser
            );
        }
    }
}