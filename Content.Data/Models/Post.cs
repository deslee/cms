using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Content.Data.Models
{
    public class Post
    {
        public string Id { get; set; }
        [Required]
        public Site Site { get; set; }
        [Required]
        public string Title { get; set; }
        public ICollection<Slice> Slices { get; set; }
        public ICollection<PostCategory> PostCategories { get; set; }
    }
}