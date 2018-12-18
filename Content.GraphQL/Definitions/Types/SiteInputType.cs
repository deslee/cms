using Content.Model;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteInputType: InputObjectGraphType<Site>
    {
        public SiteInputType() {
            Field(x => x.Id, nullable: true).Description("The Id of the Site");
            Field(x => x.Name).Description("The Name of the Site");
        }
    }
}