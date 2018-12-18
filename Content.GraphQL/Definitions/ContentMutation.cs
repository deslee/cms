using System;
using Content.Data;
using Content.GraphQL.Definitions.Types;
using Content.Model;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly DbContextOptions<DataContext> _dbContextOptions;

        public ContentMutation(DbContextOptions<DataContext> dbContextOptions)
        {
            _dbContextOptions = dbContextOptions;
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

        private Site UpsertSite(Site site)
        {
            using (var db = new DataContext(_dbContextOptions))
            {
                var dbSite = new Content.Data.Models.Site
                {
                    Id = site.Id,
                    Name = site.Name
                };
                db.Sites.Add(dbSite);
                db.SaveChanges();
                return new Site
                {
                    Id = dbSite.Id,
                    Name = dbSite.Name
                };
            }
        }
    }
}