using System;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class PostGroup
    {
        public string PostId { get; set; }
        public Post Post { get; set; }
        public string GroupId { get; set; }
        public Group Group { get; set; }
        public int Order { get; set; }
    }
}