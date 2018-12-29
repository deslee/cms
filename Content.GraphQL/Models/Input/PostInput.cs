using System.Collections.Generic;
using Content.GraphQL.Annotations;
using Content.GraphQL.Definitions.Types;

namespace Content.GraphQL.Models.Input
{
    public class PostInput
    {
        public string Id { get; set; }
        [MapsToData(PostType.TITLE_KEY)]
        public string Title { get; set; }
        public IList<string> Categories { get; set; }
        [MapsToData(PostType.SLICES_KEY)]
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