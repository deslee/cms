using System;
using Content.Data.Models;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;

namespace Content.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // composite keys
            modelBuilder.Entity<AssetSlice>().HasKey(e => new { e.AssetId, e.SliceId });
            modelBuilder.Entity<PostCategory>().HasKey(e => new { e.PostId, e.CategoryId });

            // inheritance
            modelBuilder.Entity<Slice>(
                slice => slice.HasDiscriminator(t => t.Type)
                    .HasValue<ParagraphSlice>("paragraph")
                    .HasValue<ImagesSlice>("images")
                    .HasValue<VideoSlice>("video")
            );
            modelBuilder.Entity<Asset>(
                slice => slice.HasDiscriminator(t => t.Type)
                    .HasValue<ImageAsset>("image")
            );
        }

        public DbSet<Site> Sites { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Slice> Slices { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetSlice> AssetSlices { get; set; }
        public DbSet<PostCategory> PostCategories { get; set; }
        public string ConnectionString { get; }
    }
}
