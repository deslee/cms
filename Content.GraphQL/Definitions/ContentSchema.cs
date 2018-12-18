using Content.GraphQL.Definitions.Types;
using GraphQL;
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
        }
    }
}