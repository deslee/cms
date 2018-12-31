using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class SiteUser : IAuditable
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string SiteId { get; set; }
        public Site Site { get; set; }
        public int Order { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}