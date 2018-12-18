using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Core.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Definitions
{
    public class ContentQuery : ObjectGraphType
    {
        public ContentQuery()
        {
            Name = "Query";

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => this.GetSites()
            );
        }

        private async Task<IList<Site>> GetSites()
        {
        }
    }
}