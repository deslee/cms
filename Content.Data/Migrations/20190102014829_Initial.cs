using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Content.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sites",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Data = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    Salt = table.Column<string>(nullable: true),
                    Data = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    SiteId = table.Column<string>(nullable: false),
                    State = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Data = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assets_Sites_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Sites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    SiteId = table.Column<string>(nullable: false),
                    Data = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Groups_Sites_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Sites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    SiteId = table.Column<string>(nullable: false),
                    Data = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Items_Sites_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Sites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteUsers",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    SiteId = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteUsers", x => new { x.UserId, x.SiteId });
                    table.ForeignKey(
                        name: "FK_SiteUsers_Sites_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Sites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SiteUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemAssets",
                columns: table => new
                {
                    ItemId = table.Column<string>(nullable: false),
                    AssetId = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemAssets", x => new { x.ItemId, x.AssetId });
                    table.ForeignKey(
                        name: "FK_ItemAssets_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemAssets_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemGroups",
                columns: table => new
                {
                    ItemId = table.Column<string>(nullable: false),
                    GroupId = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastUpdatedBy = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemGroups", x => new { x.ItemId, x.GroupId });
                    table.ForeignKey(
                        name: "FK_ItemGroups_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemGroups_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_SiteId",
                table: "Assets",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_SiteId",
                table: "Groups",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemAssets_AssetId",
                table: "ItemAssets",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemGroups_GroupId",
                table: "ItemGroups",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_SiteId",
                table: "Items",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteUsers_SiteId",
                table: "SiteUsers",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemAssets");

            migrationBuilder.DropTable(
                name: "ItemGroups");

            migrationBuilder.DropTable(
                name: "SiteUsers");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Sites");
        }
    }
}
