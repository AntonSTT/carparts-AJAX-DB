using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSP_LR_ALL.Migrations
{
    /// <inheritdoc />
    public partial class FavAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Favourites",
                table: "CarParts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Favourites",
                table: "CarParts");
        }
    }
}
