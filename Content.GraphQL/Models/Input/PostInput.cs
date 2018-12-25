using System.Collections.Generic;
using Content.GraphQL.Annotations;

namespace Content.GraphQL.Models.Input
{
    public class PostInput
    {
        public string Id { get; set; }
        [MapsToData]
        public string Title { get; set; }
        public IList<string> Categories { get; set; }
        [MapsToData]
        public IList<SliceInput> Slices { get; set; }
    }

    public class SliceInput
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Content { get; set; }
        public bool Autoplay { get; set; }
        public bool Loop { get; set; }
        public string Url { get; set; }
        public IList<string> Images { get; set; }
    }
}