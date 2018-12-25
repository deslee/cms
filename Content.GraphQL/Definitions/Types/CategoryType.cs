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
    public class CategoryType : ObjectGraphType<Group>
    {
        private DataContext dataContext;

        public CategoryType(DataContext dataContext)
        {
            this.dataContext = dataContext;
            Name = "Category";

            Field<StringGraphType>(
                name: "name",
                description: "The name of the Category",
                resolve: context => context.Source.Name
            );

            FieldAsync<ListGraphType<PostType>>(
                name: "posts",
                description: "The posts of the Category",
                resolve: async context => {
                    dataContext.Attach(context.Source);
                    return await dataContext.Entry(context.Source)
                        .Collection(p => p.PostGroups)
                        .Query()
                        .Select(pg => pg.Post)
                        .ToListAsync();
                }
            );
        }
    }
}