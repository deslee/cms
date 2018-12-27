using System;
using System.Collections.Generic;
using Content.GraphQL.Definitions.Middleware;
using Content.GraphQL.Definitions.Types;
using GraphQL;
using GraphQL.Instrumentation;
using GraphQL.Types;

namespace Content.GraphQL.Definitions
{
    public class ContentSchema : Schema
    {
        public ContentSchema(IDependencyResolver resolver)
            : base(resolver)
        {
            Query = resolver.Resolve<ContentQuery>();
            Mutation = resolver.Resolve<ContentMutation>();

            // register middleware
            var middlewares = resolver.Resolve<IEnumerable<IFieldMiddleware>>();
            FieldMiddlewareBuilder builder = new FieldMiddlewareBuilder();
            foreach (var middleware in middlewares)
            {
                builder.Use(next => ctx => {
                    return middleware.Resolve(ctx, next);
                });
            }
            builder.ApplyTo(this);

            RegisterType<ParagraphSliceType>();
            RegisterType<VideoSliceType>();
            RegisterType<ImagesSliceType>();
        }
    }
}