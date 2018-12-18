using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Content.Data.Models
{
    public class Category
    {
        public string Id { get; set; }
        public Site Site { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<PostCategory> PostCategories { get; set; }
    }
}