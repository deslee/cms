using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Services;
using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteType: ObjectGraphType<Site>
    {
        public SiteType(DataContext dataContext) {
            Name = "Site";
            Field(t => t.Id).Description("The id of the Site");
            Field(t => t.Name).Description("The name of the Site");
            Field<DateTimeGraphType>("createdAt", resolve: context => context.Source.CreatedAt);
            Field(t => t.CreatedBy);
            Field<DateTimeGraphType>("lastUpdatedAt", resolve: context => context.Source.LastUpdatedAt);
            Field(t => t.LastUpdatedBy);
            FieldAsync<ListGraphType<AssetType>>("assets", resolve: async context => {
                await dataContext.Entry(context.Source).Collection(s => s.Assets).LoadAsync();
                return context.Source.Assets;
            });
            Field<StringGraphType>(
                name: "data",
                description: "Serialized JSON representation of site data",
                resolve: context => JsonConvert.SerializeObject(context.Source.Data)
            );
            FieldAsync<ListGraphType<GroupType>>(
                name: "groups", 
                description: "The groups of the Site",
                resolve: async context => {
                    await dataContext.Entry(context.Source).Collection(s => s.Groups).LoadAsync();
                    return context.Source.Groups;
                }
            );
            FieldAsync<ListGraphType<ItemType>>(
                name: "items", 
                description: "The items of the Site",
                resolve: async context => {
                    await dataContext.Entry(context.Source).Collection(s => s.Items).LoadAsync();
                    return context.Source.Items;
                }
            );
        }
    }
}