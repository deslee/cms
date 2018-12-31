using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class ItemAsset : IAuditable
    {
        public string ItemId { get; set; }
        public Item Item { get; set; }
        public string AssetId { get; set; }
        public Asset Asset { get; set; }
        public int Order { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}