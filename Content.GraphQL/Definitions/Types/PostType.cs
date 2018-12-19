using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class PostType: ObjectGraphType<Post>
    {
        public PostType() {
            Name = "Post";
            Field(x => x.Id);
            Field(x => x.Title);
        }
    }
}