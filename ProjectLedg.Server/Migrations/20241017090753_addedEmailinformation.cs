using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedEmailinformation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Emails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Emails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Emails");
        }
    }
}
