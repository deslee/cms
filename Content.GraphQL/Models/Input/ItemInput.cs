using System.Collections.Generic;
using Content.GraphQL.Definitions.Types;

namespace Content.GraphQL.Models.Input
{
    public class ItemInput
    {
        public string Id { get; set; }
        public IList<string> Groups { get; set; }
        public string Type { get; set; }
        public string Data { get; set; }
    }
}