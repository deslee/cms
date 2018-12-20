using System.Collections.Generic;

namespace Content.Data.Models
{
    public abstract class Slice
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public Post Post { get; set; }
        public ICollection<AssetSlice> AssetSlices { get; set; }
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