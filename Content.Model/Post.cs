using System;
using System.Collections.Generic;

namespace Content.Model
{
    public class Post
    {
        public string Id { get; set; }
        public Site Site { get; set; }
        public string Title { get; set; }
        public IList<Slice> Slices { get; set; }
        public IList<Category> Categories { get; set; }
    }
}
