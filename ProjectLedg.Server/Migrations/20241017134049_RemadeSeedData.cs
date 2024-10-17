using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemadeSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "39f9fc9e-6692-49c3-9209-365e7c02f54e", "AQAAAAIAAYagAAAAENHaPuBEZaZtw02CiG/z7yLSb4ommBoXI3THheCfWrLCgGSHotC+XFIWG9x/tpoL7Q==", "c5775ccc-9bd7-45aa-9831-a5dcb5d2b02a" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 17550m, 0m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "40cac00e-5079-41f2-91f5-d50f9b9bd11f", "AQAAAAIAAYagAAAAEBBi5ItVV4jqlU+AF+oUg49NfkZGvvoF4w5oGN4pn+44QyK349l9dBRe+QOX8PXORg==", "090312a5-cf7a-44fc-a7af-b02c3a4ff29c" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 0m, 17550m });
        }
    }
}
