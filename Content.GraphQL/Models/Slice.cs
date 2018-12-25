using System.Collections.Generic;

namespace Content.GraphQL.Models
{
    public abstract class Slice
    {
        public string Type { get; set; }
    }

    public class ParagraphSlice : Slice
    {
        public string Content { get; set; }
    }

    public class ImagesSlice : Slice
    {
        public List<string> Images { get; set; }
    }
    public class VideoSlice : Slice
    {
        public string Url { get; set; }
        public bool Autoplay { get; set; }
        public bool Loop { get; set; }
    }
}