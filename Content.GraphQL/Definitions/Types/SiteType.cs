using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteType: ObjectGraphType<Site>
    {
        private readonly DataContext dataContext;

        public SiteType(DataContext dataContext) {
            this.dataContext = dataContext;
            Name = "Site";
            Field(x => x.Id).Description("The Id of the Site");
            Field(x => x.Name).Description("The Name of the Site");
            Field<ListGraphType<PostType>>("posts", resolve: context => GetPosts(context.Source));
        }

        private async Task<ICollection<Post>> GetPosts(Site site)
        {
            if (site.Posts == null) {
                await dataContext.Entry(site).Collection(s => s.Posts).LoadAsync();
            }
            return site.Posts;
        }
    }
}