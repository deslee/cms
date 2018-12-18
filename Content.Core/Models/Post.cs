using System;
using System.Collections.Generic;

namespace Content.Core.Models
{
    public class Post
    {
        public string Id { get; set; }
        public Site Site { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public IList<Slice> Slices { get; set; }
        public IList<Category> Categories { get; set; }
    }
}
