using Content.Data.Models;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class LoginInputType : InputObjectGraphType<LoginInput>
    {
        public LoginInputType()
        {
            Name = "LoginInput";
            Field(r => r.Email).Description("Email Address");
            Field(r => r.Password).Description("Password");
        }
    }
}