using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class PostType : ObjectGraphType<Post>
    {
        private readonly DataContext dataContext;
        public PostType(DataContext dataContext)
        {
            Name = "Post";
            Field(x => x.Id);
            Field(x => x.Title);
            FieldAsync<ListGraphType<StringGraphType>>("categories", resolve: async context =>
            {
                if (context.Source.PostCategories == null)
                {
                    await dataContext.Entry(context.Source).Collection(p => p.PostCategories).LoadAsync();
                }
                foreach (var pc in context.Source.PostCategories)
                {
                    if (pc.Category == null)
                    {
                        await dataContext.Entry(pc).Reference(e => e.Category).LoadAsync();
                    }
                }
                return context.Source.PostCategories?.Select(pc => pc.Category.Name);
            });
            Field<ListGraphType<SliceType>>("slices", resolve: context => GetSlices(context.Source));
            this.dataContext = dataContext;
        }

        private async Task<ICollection<Slice>> GetSlices(Post post)
        {
            if (post.Slices == null)
            {
                await dataContext.Entry(post).Collection(s => s.Slices).LoadAsync();
            }
            return post.Slices;
        }
    }
}