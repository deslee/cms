using Content.Data.Models;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class ItemInputType: InputObjectGraphType<ItemInput>
    {
        public ItemInputType() {
            Name = "ItemInput";
            Field(p => p.Id, nullable: true);
            Field(p => p.Groups);
            Field(p => p.Type);
            Field(x => x.Data).Description("Serialized JSON representation of item data");
        }
    }
}