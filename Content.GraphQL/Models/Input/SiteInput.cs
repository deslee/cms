using System.Collections.Generic;
using Content.GraphQL.Definitions.Types;

namespace Content.GraphQL.Models.Input
{
    public class SiteInput
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Data { get; set; }
    }
}