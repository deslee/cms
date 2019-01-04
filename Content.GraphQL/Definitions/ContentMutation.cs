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
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Configuration;
using Content.GraphQL.Services;
using GraphQL.Authorization;
using Content.GraphQL.Definitions.Types.Result;
using Content.GraphQL.Models;
using Content.GraphQL.Helpers;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly ISiteService siteService;
        private readonly IItemService itemService;
        private readonly IUserService userService;
        private readonly IAssetService assetService;
        private readonly IMutationExecutionHelper mutationExecutionHelper;

        public ContentMutation(ISiteService siteService, IItemService itemService, IUserService userService, IAssetService assetService, IMutationExecutionHelper mutationExecutionHelper)
        {
            this.siteService = siteService;
            this.itemService = itemService;
            this.userService = userService;
            this.assetService = assetService;
            this.mutationExecutionHelper = mutationExecutionHelper;
            Name = "Mutation";

            Field<MutationResultType<Site, SiteType>>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => siteService.UpsertSite(context.GetArgument<SiteInput>("site"), (context.UserContext as UserContext)))
            ).AuthorizeWith(Content.GraphQL.Constants.Policies.Authenticated);

            Field<MutationResultType<Item, ItemType>>(
                "upsertItem",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<ItemInputType>> { Name = "item" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => itemService.UpsertItem(context.GetArgument<ItemInput>("item"), (context.UserContext as UserContext), context.GetArgument<string>("siteId")))
            ).AuthorizeWith(Content.GraphQL.Constants.Policies.Authenticated);

            Field<MutationResultType>(
                "deleteItem",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "itemId" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => itemService.DeleteItem(context.GetArgument<string>("itemId"), (context.UserContext as UserContext)))
            );

            Field<MutationResultType>(
                "deleteSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => siteService.DeleteSite(context.GetArgument<string>("siteId"), (context.UserContext as UserContext)))
            );

            Field<MutationResultType>(
                "deleteAsset",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "assetId" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => assetService.DeleteAsset(context.GetArgument<string>("assetId"), (context.UserContext as UserContext)))
            );

            Field<MutationResultType<User, UserType>>(
                "register",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<RegisterInputType>> { Name = "registration" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => userService.RegisterUser(context.GetArgument<RegisterInput>("registration")))
            );

            Field<LoginResultType>(
                "login",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<LoginInputType>> { Name = "login" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => userService.Login(context.GetArgument<LoginInput>("login")))
            );

            Field<MutationResultType<User, UserType>>(
                "updateUser",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<UserInputType>> { Name = "user" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => userService.UpdateUser(context.GetArgument<UserInput>("user")))
            );

            Field<MutationResultType>(
                "addUserToSite",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "userId", Description = "User Id. Either email or user id must be present" },
                    new QueryArgument<StringGraphType> { Name = "userEmail", Description = "Email. Either email or user id must be present" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => mutationExecutionHelper.ExecuteSafely(() => userService.AddUserToSite(userId: context.GetArgument<string>("userId"), userEmail: context.GetArgument<string>("userEmail"), siteId: context.GetArgument<string>("siteId")))
            );
        }
    }
}