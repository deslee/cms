using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class PostType: ObjectGraphType<Post>
    {
        private readonly DataContext dataContext;
        public PostType(DataContext dataContext) {
            Name = "Post";
            Field(x => x.Id);
            Field(x => x.Title);
            Field<ListGraphType<SliceType>>("slices", resolve: context => GetSlices(context.Source));
            this.dataContext = dataContext;
        }

        private async Task<ICollection<Slice>> GetSlices(Post post)
        {
            if (post.Slices == null) {
                await dataContext.Entry(post).Collection(s => s.Slices).LoadAsync();
            }
            return post.Slices;
        }
    }
}