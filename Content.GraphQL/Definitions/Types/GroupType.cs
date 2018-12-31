using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Definitions.Types
{
    public class GroupType : ObjectGraphType<Group>
    {
        private DataContext dataContext;

        public GroupType(DataContext dataContext)
        {
            this.dataContext = dataContext;
            Name = "Group";

            Field<StringGraphType>(
                name: "name",
                description: "The name of the Group",
                resolve: context => context.Source.Name
            );

            FieldAsync<ListGraphType<ItemType>>(
                name: "items",
                description: "The items in the Group",
                resolve: async context => {
                    dataContext.Attach(context.Source);
                    return await dataContext.Entry(context.Source)
                        .Collection(p => p.ItemGroups)
                        .Query()
                        .Select(pg => pg.Item)
                        .ToListAsync();
                }
            );
        }
    }
}