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
        public SiteType() {
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
                resolve: context => context.Source.Groups
            );
            Field<ListGraphType<PostType>>(
                name: "posts", 
                description: "The posts of the Site",
                resolve: context => context.Source.Posts
            );
        }
    }
}