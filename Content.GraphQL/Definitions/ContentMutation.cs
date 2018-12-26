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
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Configuration;
using Content.GraphQL.Services;
using GraphQL.Authorization;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly ISiteService siteService;
        private readonly IPostService postService;
        private readonly IUserService userService;

        public ContentMutation(ISiteService siteService, IPostService postService, IUserService userService)
        {
            this.siteService = siteService;
            this.postService = postService;
            this.userService = userService;
            Name = "Mutation";

            Field<SiteType>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: context => siteService.upsertSite(context.GetArgument<SiteInput>("site"))
            );

            Field<PostType>(
                "upsertPost",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => postService.UpsertPost(context.GetArgument<PostInput>("post"), context.GetArgument<string>("siteId"))
            ).AuthorizeWith(Content.GraphQL.Constants.Policies.BelongsToSite);

            Field<UserType>(
                "register",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<RegisterInputType>> { Name = "registration" }
                ),
                resolve: context => userService.RegisterUser(context.GetArgument<RegisterInput>("registration"))
            );

            Field<UserType>(
                "login",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<LoginInputType>> { Name = "login" }
                ),
                resolve: context => userService.Login(context.GetArgument<LoginInput>("login"))
            );
        }
    }
}