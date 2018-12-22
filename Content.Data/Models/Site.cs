using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Content.Data.Models
{
    public class Site
    {
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Asset> Assets { get; set; }
        public string Data { get; set; }
    }
}