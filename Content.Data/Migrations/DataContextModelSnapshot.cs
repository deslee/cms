﻿// <auto-generated />
using Content.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Content.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687");

            modelBuilder.Entity("Content.Data.Models.Asset", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Data");

                    b.Property<string>("SiteId")
                        .IsRequired();

                    b.Property<int>("State");

                    b.Property<int>("Type");

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Assets");
                });

            modelBuilder.Entity("Content.Data.Models.Group", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Data");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("SiteId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("Content.Data.Models.Item", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Data");

                    b.Property<string>("SiteId")
                        .IsRequired();

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Content.Data.Models.ItemAsset", b =>
                {
                    b.Property<string>("ItemId");

                    b.Property<string>("AssetId");

                    b.Property<int>("Order");

                    b.HasKey("ItemId", "AssetId");

                    b.HasIndex("AssetId");

                    b.ToTable("ItemAssets");
                });

            modelBuilder.Entity("Content.Data.Models.ItemGroup", b =>
                {
                    b.Property<string>("ItemId");

                    b.Property<string>("GroupId");

                    b.Property<int>("Order");

                    b.HasKey("ItemId", "GroupId");

                    b.HasIndex("GroupId");

                    b.ToTable("ItemGroups");
                });

            modelBuilder.Entity("Content.Data.Models.Site", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Data");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Sites");
                });

            modelBuilder.Entity("Content.Data.Models.SiteUser", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("SiteId");

                    b.Property<int>("Order");

                    b.HasKey("UserId", "SiteId");

                    b.HasIndex("SiteId");

                    b.ToTable("SiteUsers");
                });

            modelBuilder.Entity("Content.Data.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Data");

                    b.Property<string>("Email");

                    b.Property<string>("Password");

                    b.Property<string>("Salt");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Content.Data.Models.Asset", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Assets")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.Group", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Groups")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.Item", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Items")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.ItemAsset", b =>
                {
                    b.HasOne("Content.Data.Models.Asset", "Asset")
                        .WithMany("ItemAssets")
                        .HasForeignKey("AssetId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Content.Data.Models.Item", "Item")
                        .WithMany("ItemAssets")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.ItemGroup", b =>
                {
                    b.HasOne("Content.Data.Models.Group", "Group")
                        .WithMany("ItemGroups")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Content.Data.Models.Item", "Item")
                        .WithMany("ItemGroups")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.SiteUser", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("SiteUsers")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Content.Data.Models.User", "User")
                        .WithMany("SiteUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
