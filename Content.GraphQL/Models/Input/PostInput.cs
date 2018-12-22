using System.Collections.Generic;

namespace Content.GraphQL.Models.Input
{
    public class PostInput
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Data { get; set; }
        public IList<string> Categories { get; set; }
        public IList<SliceInput> Slices { get; set; }
    }

    public class SliceInput
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public bool Autoplay { get; set; }
        public bool Loop { get; set; }
        public string Url { get; set; }
        public string Data { get; set; }
        public IList<string> Assets { get; set; }
    }
}