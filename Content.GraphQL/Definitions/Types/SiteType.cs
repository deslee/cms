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
        public const string TITLE_KEY = "Title";
        public const string SUBTITLE_KEY = "Subtitle";
        public const string GOOGLE_ANALYTICS_ID_KEY = "GoogleAnalyticsId";
        public const string COPYRIGHT_KEY = "Copyright";

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
            FieldAsync<ListGraphType<PostType>>(
                name: "posts", 
                description: "The posts of the Site",
                resolve: async context => {
                    await dataContext.Entry(context.Source).Collection(s => s.Items).LoadAsync();
                    return context.Source.Items;
                }
            );
            Field<StringGraphType>(
                "title",
                resolve: context => context.Source.Data[TITLE_KEY].ToString()
            );
            Field<StringGraphType>(
                "subtitle",
                resolve: context => context.Source.Data[SUBTITLE_KEY].ToString()
            );
            Field<StringGraphType>(
                "googleAnalyticsId",
                resolve: context => context.Source.Data[GOOGLE_ANALYTICS_ID_KEY].ToString()
            );
            Field<StringGraphType>(
                "copyright",
                resolve: context => context.Source.Data[COPYRIGHT_KEY].ToString()
            );
        }
    }
}