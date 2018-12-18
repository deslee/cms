using System;
using System.Collections.Generic;
using System.Linq;
using Content.Data;
using Content.GraphQL.Definitions.Types;
using Content.Model;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Definitions
{
    public class ContentQuery : ObjectGraphType
    {
        private readonly DbContextOptions<DataContext> _dbContextOptions;

        public ContentQuery(DbContextOptions<DataContext> dbContextOptions)
        {
            Name = "Query";
            _dbContextOptions = dbContextOptions;

            Field<ListGraphType<SiteType>>(
                "sites",
                resolve: context => this.GetSites()
            );
        }

        private IList<Site> GetSites()
        {
            using (var db = new DataContext(_dbContextOptions))
            {
                return db.Sites.Select(s => new Site
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList();
            }
        }
    }
}