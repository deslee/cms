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
            Field<StringGraphType>(
                name: "id",
                description: "The id of the Site",
                resolve: context => context.Source.Id.ToString()
            );
            Field<StringGraphType>(
                name: "name",
                description: "The name of the Site",
                resolve: context => context.Source.Name.ToString()
            );
            Field<ListGraphType<CategoryType>>(
                name: "categories", 
                description: "The categories of the Site",
                resolve: context => GetCategories(context.Source)
            );
            Field<ListGraphType<PostType>>(
                name: "posts", 
                description: "The posts of the Site",
                resolve: context => GetPosts(context.Source)
            );
        }

        private async Task<ICollection<Post>> GetPosts(Site site)
        {
            dataContext.Sites.Attach(site);
            await dataContext.Entry(site).Collection(s => s.Posts).LoadAsync();
            return site.Posts;
        }

        private async Task<ICollection<Group>> GetCategories(Site site)
        {
            dataContext.Sites.Attach(site);
            await dataContext.Entry(site).Collection(s => s.Groups).LoadAsync();
            return site.Groups;
        }
    }
}