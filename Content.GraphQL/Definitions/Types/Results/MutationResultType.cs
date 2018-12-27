using Content.Data.Models;
using Content.GraphQL.Models.Input;
using Content.GraphQL.Models.Result;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Result
{
    public class MutationResultType : ObjectGraphType<MutationResult>
    {
        public MutationResultType()
        {
            Name = "GenericResult";
            Field(r => r.Success).Description("Indicates Success");
            Field(r => r.ErrorMessage, nullable: true).Description("The error message");
        }
    }

    public class MutationResultType<S, T> : ObjectGraphType<MutationResult<S>> where T : IGraphType
    {
        public MutationResultType()
        {
            Name = typeof(S).Name + "Result";
            Field(r => r.Success).Description("Indicates Success");
            Field<T>("data", resolve: ctx => ctx.Source.Data);
            Field(r => r.ErrorMessage, nullable: true).Description("The error message");
        }
    }
}