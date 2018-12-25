using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.Data.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class Post
    {
        public string Id { get; set; }
        [Required]
        public Site Site { get; set; }
        [JsonString]
        public JObject Data { get; set; }
        public virtual ICollection<PostGroup> PostGroups { get; set; }
    }
}