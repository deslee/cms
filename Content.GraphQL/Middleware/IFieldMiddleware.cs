using System.Threading.Tasks;
using GraphQL.Instrumentation;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Middleware {
    public interface IFieldMiddleware {
        Task<object> Resolve(ResolveFieldContext context, FieldMiddlewareDelegate next);
    }
}