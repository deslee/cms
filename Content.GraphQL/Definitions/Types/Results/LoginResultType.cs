using Content.Data.Models;
using Content.GraphQL.Models.Input;
using Content.GraphQL.Models.Result;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Result
{
    public class LoginResultType : ObjectGraphType<LoginResult>
    {
        public LoginResultType()
        {
            Name = "LoginResult";
            Field(r => r.Success).Description("Indicates Success");
            Field(r => r.ErrorMessage, nullable: true).Description("The error message");
            Field<UserType>("data", resolve: ctx => ctx.Source.Data);
            Field(r => r.Token, nullable: true);
        }
    }
}