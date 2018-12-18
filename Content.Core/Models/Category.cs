using System;
using System.Collections.Generic;

namespace Content.Core.Models
{
    public class Category
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IList<Post> Post { get; set; }
    }
}
