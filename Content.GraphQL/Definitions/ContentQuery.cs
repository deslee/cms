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
        private readonly IItemService itemService;
        private readonly IUserService userService;

        public ContentQuery(ISiteService siteService, IItemService itemService, IUserService userService)
        {
            Name = "Query";
            this.siteService = siteService;
            this.itemService = itemService;
            this.userService = userService;

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => siteService.GetSites((context.UserContext as UserContext))
            );
            Field<SiteType>(
                "site",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => siteService.GetSite(context.GetArgument<string>("siteId"))
            );
            Field<ListGraphType<ItemType>>(
                "items",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: context => itemService.GetItems(context.GetArgument<string>("siteId"))
            );
            Field<ItemType>(
                "item",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "itemId" }
                ),
                resolve: context => itemService.GetItem(context.GetArgument<string>("itemId"))
            );
            Field<UserType>(
                "me",
                resolve: context => userService.GetUserById((context.UserContext as UserContext)?.Id)
            );
        }
    }
}