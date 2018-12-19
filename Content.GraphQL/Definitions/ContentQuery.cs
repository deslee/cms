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

namespace Content.GraphQL.Definitions
{
    public class ContentQuery : ObjectGraphType
    {
        private readonly DataContext dataContext;

        public ContentQuery(DataContext dataContext)
        {
            this.dataContext = dataContext;
            Name = "Query";

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => this.GetSites()
            );
            Field<SiteType>(
                "site",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "siteId" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<string>("siteId");
                    return this.GetSite(id);
                }
            );
        }

        private async Task<Site> GetSite(string id)
        {
            return await dataContext.Sites
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        private async Task<IList<Site>> GetSites()
        {
            return await dataContext.Sites
                .Select(s => new Site
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();
        }
    }
}