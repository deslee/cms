using Content.Model;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteType: ObjectGraphType<Site>
    {
        public SiteType() {
            Field(x => x.Id).Description("The Id of the Site");
            Field(x => x.Name).Description("The Name of the Site");
        }
    }
}