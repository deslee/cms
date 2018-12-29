using Content.Data.Models;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class SiteInputType: InputObjectGraphType<SiteInput>
    {
        public SiteInputType() {
            Name = "SiteInput";
            Field(x => x.Id, nullable: true).Description("The Id of the Site");
            Field(x => x.Name).Description("The Name of the Site");
            Field(x => x.Title);
            Field(x => x.Subtitle, nullable: true);
            Field(x => x.GoogleAnalyticsId, nullable: true);
            Field(x => x.Copyright, nullable: true);
        }
    }
}