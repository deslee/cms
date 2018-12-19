﻿// <auto-generated />
using System;
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

                    b.Property<string>("Description");

                    b.Property<string>("SiteId");

                    b.Property<string>("Title");

                    b.Property<string>("Type")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Assets");

                    b.HasDiscriminator<string>("Type").HasValue("Asset");
                });

            modelBuilder.Entity("Content.Data.Models.AssetSlice", b =>
                {
                    b.Property<string>("AssetId");

                    b.Property<string>("SliceId");

                    b.HasKey("AssetId", "SliceId");

                    b.HasIndex("SliceId");

                    b.ToTable("AssetSlices");
                });

            modelBuilder.Entity("Content.Data.Models.Category", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("SiteId");

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Content.Data.Models.Post", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<string>("SiteId")
                        .IsRequired();

                    b.Property<string>("Title")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("SiteId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("Content.Data.Models.PostCategory", b =>
                {
                    b.Property<string>("PostId");

                    b.Property<string>("CategoryId");

                    b.HasKey("PostId", "CategoryId");

                    b.HasIndex("CategoryId");

                    b.ToTable("PostCategories");
                });

            modelBuilder.Entity("Content.Data.Models.Site", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Sites");
                });

            modelBuilder.Entity("Content.Data.Models.Slice", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("PostId");

                    b.Property<string>("Type")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("Slices");

                    b.HasDiscriminator<string>("Type").HasValue("Slice");
                });

            modelBuilder.Entity("Content.Data.Models.ImageAsset", b =>
                {
                    b.HasBaseType("Content.Data.Models.Asset");

                    b.Property<string>("Url");

                    b.HasDiscriminator().HasValue("image");
                });

            modelBuilder.Entity("Content.Data.Models.ImagesSlice", b =>
                {
                    b.HasBaseType("Content.Data.Models.Slice");

                    b.HasDiscriminator().HasValue("images");
                });

            modelBuilder.Entity("Content.Data.Models.ParagraphSlice", b =>
                {
                    b.HasBaseType("Content.Data.Models.Slice");

                    b.Property<string>("Text");

                    b.HasDiscriminator().HasValue("paragraph");
                });

            modelBuilder.Entity("Content.Data.Models.VideoSlice", b =>
                {
                    b.HasBaseType("Content.Data.Models.Slice");

                    b.Property<bool>("Autoplay");

                    b.Property<bool>("Loop");

                    b.Property<string>("Url");

                    b.HasDiscriminator().HasValue("video");
                });

            modelBuilder.Entity("Content.Data.Models.Asset", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Assets")
                        .HasForeignKey("SiteId");
                });

            modelBuilder.Entity("Content.Data.Models.AssetSlice", b =>
                {
                    b.HasOne("Content.Data.Models.Asset", "Asset")
                        .WithMany("AssetSlices")
                        .HasForeignKey("AssetId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Content.Data.Models.Slice", "Slice")
                        .WithMany("AssetSlices")
                        .HasForeignKey("SliceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.Category", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Categories")
                        .HasForeignKey("SiteId");
                });

            modelBuilder.Entity("Content.Data.Models.Post", b =>
                {
                    b.HasOne("Content.Data.Models.Site", "Site")
                        .WithMany("Posts")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.PostCategory", b =>
                {
                    b.HasOne("Content.Data.Models.Category", "Category")
                        .WithMany("PostCategories")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Content.Data.Models.Post", "Post")
                        .WithMany("PostCategories")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Content.Data.Models.Slice", b =>
                {
                    b.HasOne("Content.Data.Models.Post", "Post")
                        .WithMany("Slices")
                        .HasForeignKey("PostId");
                });
#pragma warning restore 612, 618
        }
    }
}
