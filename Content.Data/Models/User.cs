using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.Data.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class User
    {
        public string Id { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        [JsonString]
        public JObject Data { get; set; }
        public virtual ICollection<SiteUser> SiteUsers { get; set; }
    }
}