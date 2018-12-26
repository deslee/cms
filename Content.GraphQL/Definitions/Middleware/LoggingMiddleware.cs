using System.Threading.Tasks;
using GraphQL.Instrumentation;
using GraphQL.Server;
using GraphQL.Types;
using Microsoft.Extensions.Logging;

namespace Content.GraphQL.Definitions.Middleware
{
    public class LoggingMiddleware : IFieldMiddleware
    {
        private readonly ILogger<LoggingMiddleware> logger;

        public LoggingMiddleware(ILogger<LoggingMiddleware> logger) {
            this.logger = logger;
        }

        public async Task<object> Resolve(ResolveFieldContext context, FieldMiddlewareDelegate next)
        {
            logger.LogInformation("Resolving {field}", context.FieldName);
            var res = await next(context);
            return res;
        }
    }
}