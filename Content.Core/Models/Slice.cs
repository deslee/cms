using System;
using System.Collections.Generic;

namespace Content.Core.Models
{
    public abstract class Slice
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public IList<Asset> Assets { get; set; }
    }
    public class ParagraphSlice : Slice
    {
        public string Text { get; set; }
    }
    public class VideoSlice : Slice
    {
        public bool Autoplay { get; set; }
        public bool Loop { get; set; }
        public string Url { get; set; }
    }
    public class ImagesSlice : Slice
    {
    }
}
