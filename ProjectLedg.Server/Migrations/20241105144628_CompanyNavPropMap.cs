using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class CompanyNavPropMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "552bc731-2408-4e3b-b320-cfefee157c0d", "AQAAAAIAAYagAAAAEKmbUHNuvMIDfMew6oav5F85aOzzQAiuoto/vWzPgZLLr9VBdIhLswhKUcinn8LKLA==", "1fb732ad-52dc-42dc-b382-45197bdcea9b" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d6d98d85-cf45-4f5d-aa1c-f703df35a45a", "AQAAAAIAAYagAAAAEJGX4cYlfWDttHbVUAdCK+Mtsyzjpcq+lzWQW1bWmYWIxUQCczqtWfA3Vcl/ZXJM0g==", "63e0111a-62c2-48b2-9f4f-26f25de40d43" });
        }
    }
}
