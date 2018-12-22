using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Content.Data.Models
{
    public abstract class Asset
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public Site Site { get; set; }
        public ICollection<AssetSlice> AssetSlices { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Data { get; set; }
    }
    public class ImageAsset : Asset
    {
        public string Url { get; set; }
    }
}