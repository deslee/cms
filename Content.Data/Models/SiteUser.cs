using System;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class SiteUser
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string SiteId { get; set; }
        public Site Site { get; set; }
        public int Order { get; set; }
    }
}