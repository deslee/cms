using System;
using System.Collections.Generic;
using Content.Data.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class Site
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonString]
        public JObject Data { get; set; }
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<Group> Groups { get; set; }
        public virtual ICollection<Asset> Assets { get; set; }
        public virtual ICollection<SiteUser> SiteUsers { get; set; }
    }
}