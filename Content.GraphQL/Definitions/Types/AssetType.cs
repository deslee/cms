using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Definitions.Types
{
    public class AssetType : ObjectGraphType<Asset>
    {
        public AssetType(DataContext dataContext)
        {
            Name = "Asset";
            Field(t => t.Id).Description("The id of the Asset");
            Field<DateTimeGraphType>("createdAt", resolve: context => context.Source.CreatedAt);
            Field(t => t.CreatedBy);
            Field(t => t.Type);
            Field(t => t.State);
            Field<DateTimeGraphType>("lastUpdatedAt", resolve: context => context.Source.LastUpdatedAt);
            Field(t => t.LastUpdatedBy);
            Field<StringGraphType>("fileName", resolve: context => {
                if (context.Source.Data.TryGetValue("fileName", out var value))
                {
                    return value.ToString();
                }
                return null;
            });
            Field<StringGraphType>("extension", resolve: context => {
                if (context.Source.Data.TryGetValue("extension", out var value))
                {
                    return value.ToString();
                }
                return null;
            });
            FieldAsync<ListGraphType<ItemType>>("items", resolve: async context =>
            {
                return await dataContext.ItemAssets
                .Include(ia => ia.Item)
                .Where(ia => ia.AssetId == context.Source.Id)
                .Select(ia => ia.Item)
                .ToListAsync();
            });
        }
    }
}