using System;
using Newtonsoft.Json.Linq;

namespace Content.Data.Models
{
    public class ItemGroup
    {
        public string ItemId { get; set; }
        public Item Item { get; set; }
        public string GroupId { get; set; }
        public Group Group { get; set; }
        public int Order { get; set; }
    }
}