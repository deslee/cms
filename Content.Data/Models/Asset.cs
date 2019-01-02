using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Content.Data.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class Asset : IAuditable
    {
        public string Id { get; set; }
        [Required]
        public Site Site { get; set; }
        public string State { get; set; }
        public string Type { get; set; }
        [JsonString]
        public JObject Data { get; set; }
        public virtual ICollection<ItemAsset> ItemAssets { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}