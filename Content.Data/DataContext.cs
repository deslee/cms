using System;
using Content.Data.Annotations;
using Content.Data.Models;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            modelBuilder.Entity<ItemGroup>().HasKey(e => new { e.ItemId, e.GroupId });
            modelBuilder.Entity<SiteUser>().HasKey(e => new { e.UserId, e.SiteId });

            modelBuilder.Entity<User>().HasIndex(e => e.Email).IsUnique();

            var jsonStringConverter = new ValueConverter<JObject, string>(
                data => JsonConvert.SerializeObject(data),
                data => JsonConvert.DeserializeObject<JObject>(data)
            );

            var types = typeof(Site).Assembly.GetTypes();

            foreach(Type type in types) {
                if (type.Namespace != null && type.Namespace.StartsWith(typeof(Site).Namespace)) {
                    foreach (var property in type.GetProperties()) {
                        var attributes = property.GetCustomAttributes(typeof(JsonStringAttribute), false);
                        if (attributes.Length > 0) {
                            modelBuilder.Entity(type)
                                .Property(property.Name)
                                .HasConversion(jsonStringConverter);
                        }
                    }
                }
            }

        }

        public DbSet<Site> Sites { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<ItemGroup> ItemGroups { get; set; }
        public DbSet<SiteUser> SiteUsers { get; set; }
        public string ConnectionString { get; }
    }
}
