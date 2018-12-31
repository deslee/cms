using System;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class ItemAsset
    {
        public string ItemId { get; set; }
        public Item Item { get; set; }
        public string AssetId { get; set; }
        public Asset Asset { get; set; }
        public int Order { get; set; }
    }
}