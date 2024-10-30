using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedvirtualnavpropsItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c84d6a1c-49a3-47e4-8a69-bda6bfb2e8fd", "AQAAAAIAAYagAAAAEApBzng1a3y/xrfgyRFxS6d22dMF+NzHzm9wlML18mtB5XJaeHnU3b8zcc4d9A1TfA==", "1e85e01a-ec25-44e7-9cc1-c785efa62765" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "54296b91-324a-49e0-b8cf-7f237a2c0119", "AQAAAAIAAYagAAAAEF9PVXe2jC0f8gjtG3kgMNz593XPgxcw7IOyBG/A/nj92A2mCbZhkYLg7M4AqEUV+g==", "58fe77f4-281d-45b8-bca2-1d6ea00ceb3a" });
        }
    }
}
