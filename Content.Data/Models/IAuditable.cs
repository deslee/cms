using System;

namespace Content.Data.Models
{
    public interface IAuditable
    {
        string CreatedBy { get; set; }
        string LastUpdatedBy { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime LastUpdatedAt { get; set; }
    }
}