using System;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Core.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        public ContentMutation()
        {
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
        }

        private async Task<Site> UpsertSite(Site site)
        {
        }
    }
}