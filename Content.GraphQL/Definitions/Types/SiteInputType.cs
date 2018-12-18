using Content.Core.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SiteInputType: InputObjectGraphType<Site>
    {
        public SiteInputType() {
            Name = "SiteInput";
            Field(x => x.Id, nullable: true).Description("The Id of the Site");
            Field(x => x.Name).Description("The Name of the Site");
        }
    }
}