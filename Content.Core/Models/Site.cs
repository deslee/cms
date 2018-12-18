using System;
using System.Collections.Generic;

namespace Content.Core.Models
{
    public class Site
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IList<Category> Categories { get; set; }
        public IList<Post> Posts { get; set; }
        public IList<Asset> Assets { get; set; }
    }
}
