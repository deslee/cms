using Content.Data.Models;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class RegisterInputType : InputObjectGraphType<RegisterInput>
    {
        public RegisterInputType()
        {
            Name = "RegisterInput";
            Field(r => r.Email).Description("Email Address");
            Field(x => x.Data).Description("Serialized JSON representation of user data");
            Field(r => r.Password).Description("Password");
        }
    }
}