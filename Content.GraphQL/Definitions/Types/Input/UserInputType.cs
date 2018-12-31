using Content.GraphQL.Models.Input;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class UserInputType: InputObjectGraphType<UserInput> {
        public UserInputType() {
            Name = "UserInput";
            Field(u => u.Id);
            Field(u => u.Email);
            Field(u => u.Data);
        }
    }
}