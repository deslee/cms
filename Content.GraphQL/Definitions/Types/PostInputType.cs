using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class PostInputType: InputObjectGraphType<object>
    {
        public PostInputType() {
            Name = "PostInput";
            Field<StringGraphType>("id");
            Field<StringGraphType>("title");
            Field<ListGraphType<SliceInputType>>("slices");
        }
    }
}