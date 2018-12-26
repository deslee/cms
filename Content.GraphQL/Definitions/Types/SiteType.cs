using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Services;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteType: ObjectGraphType<Site>
    {
        public SiteType(DataContext dataContext) {
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
            FieldAsync<ListGraphType<CategoryType>>(
                name: "categories", 
                description: "The categories of the Site",
                resolve: async context => {
                    await dataContext.Entry(context.Source).Collection(s => s.Groups).LoadAsync();
                    return context.Source.Groups;
                }
            );
            Field<ListGraphType<PostType>>(
                name: "posts", 
                description: "The posts of the Site",
                resolve: context => context.Source.Posts
            );
        }
    }
}