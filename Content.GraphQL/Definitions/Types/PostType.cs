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
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Definitions.Types
{
    public class PostType : ObjectGraphType<Post>
    {
        private readonly DataContext dataContext;
        public PostType(DataContext dataContext)
        {
            Name = "Post";
            Field<StringGraphType>(
                name: "id",
                description: "The id of the Post",
                resolve: context => context.Source.Id.ToString()
            );
            Field<StringGraphType>(
                name: "title",
                description: "The title of the Post",
                resolve: context => context.Source.Data["Title"].ToObject<string>()
            );
            FieldAsync<ListGraphType<CategoryType>>(
                name: "categories",
                description: "The categories of the Post",
                resolve: async context =>
                {
                    dataContext.Attach(context.Source);

                    return await dataContext.Entry(context.Source)
                        .Collection(p => p.PostGroups)
                        .Query()
                        .Include(pg => pg.Group)
                        .Select(pg => pg.Group)
                        .ToListAsync();
                }
            );
            Field<ListGraphType<SliceType>>(
                name: "slices",
                description: "The slices of the Post",
                resolve: context => {
                    return context.Source.Data["Slices"].Select<JToken, Slice>(slice => {
                        if (slice["Type"].ToObject<string>() == "paragraph") {
                            return slice.ToObject<ParagraphSlice>();
                        }
                        else if (slice["Type"].ToObject<string>() == "images") {
                            return slice.ToObject<ImagesSlice>();
                        }
                        else if (slice["Type"].ToObject<string>() == "video") {
                            return slice.ToObject<VideoSlice>();
                        }
                        return null;
                    });
                }
            );
            this.dataContext = dataContext;
        }
    }
}