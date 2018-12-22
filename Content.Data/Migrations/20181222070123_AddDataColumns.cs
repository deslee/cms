using Microsoft.EntityFrameworkCore.Migrations;

namespace Content.Data.Migrations
{
    public partial class AddDataColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "Slices",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "Sites",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "Posts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "Assets",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "Slices");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Sites");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Assets");
        }
    }
}
