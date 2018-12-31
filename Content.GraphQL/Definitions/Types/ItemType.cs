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
    public class ItemType : ObjectGraphType<Item>
    {
        public ItemType(DataContext dataContext)
        {
            Name = "Item";
            Field(t => t.Id).Description("The id of the Item");
            Field<DateTimeGraphType>("createdAt", resolve: context => context.Source.CreatedAt);
            Field(t => t.CreatedBy);
            Field<DateTimeGraphType>("lastUpdatedAt", resolve: context => context.Source.LastUpdatedAt);
            Field(t => t.LastUpdatedBy);
            Field<StringGraphType>(
                name: "data",
                description: "Serialized JSON representation of item data",
                resolve: context => JsonConvert.SerializeObject(context.Source.Data)
            );
            FieldAsync<ListGraphType<GroupType>>(
                name: "groups",
                description: "The Groups that the Item belongs to",
                resolve: async context =>
                {
                    dataContext.Attach(context.Source);

                    return await dataContext.Entry(context.Source)
                        .Collection(p => p.ItemGroups)
                        .Query()
                        .Select(pg => pg.Group)
                        .ToListAsync();
                }
            );
        }
    }
}