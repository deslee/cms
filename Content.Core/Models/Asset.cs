using System;
using System.Collections.Generic;

namespace Content.Core.Models
{
    public abstract class Asset
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
    public class ImageAsset : Asset
    {
        public string Url { get; set; }
    }
}
