using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class SupportTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "SupportTickets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8b7b3b7e-dc0b-4e87-834e-63fe5ecd2771", "AQAAAAIAAYagAAAAEJ4KXfFrx1DJn3vk7wTCb3jlUJfIIXosnkyr7k1HBitfuCAiwVDaqdomuDxDGlszfw==", "9ad209f7-ac11-47fa-9211-500ffd7cacc3" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "51d2a97b-4c68-48fd-807e-ecc20b34c847", "AQAAAAIAAYagAAAAEOIj0mX7dv71P065Ps2LqLYwe6Zyo4CDUgj2cPNNYzx87hSdUamgScxl4sM0gCwDPA==", "dccd1051-1c8e-4079-8051-5aa2de8cad9a" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c860cb37-447f-41dd-ab39-4d80ce40d64d", "AQAAAAIAAYagAAAAEKE7l8WoeDkV8ukH7S70U9d0O4ssBBtuXarOHau+2j9GMwsD8zdkIIhzk/WCBDgDEg==", "8df15bc3-9048-4ac6-81f2-ee427d065fc3" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "SupportTickets");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9cc5db8a-667c-4f90-a9ab-af6cd11b77ae", "AQAAAAIAAYagAAAAEJS+n1ABiWUfNJRwYfmVsXmn3EMI7KKa5NSV7YV+z00YfhEKVWp5wsgGVVD/QNtHQw==", "7e50dca2-4533-428b-9c6e-e17f3affff2e" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8c15ea3a-30af-4f09-bb57-98f5bd1a41fd", "AQAAAAIAAYagAAAAELCzMMNKLcEap7usdOCVVkE1LuZjPLWWM3PJUnXoskzZ5smcFeq7k9q1tV6Qzpyc4g==", "28cde7b7-fe87-49c8-a45a-da8ca3548cf7" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "be8b4c64-b0b8-4e4b-8c42-dbeeff8ad8a8", "AQAAAAIAAYagAAAAECan288oIQtaPTwqFpAD2d/b27mxkbLfu7UJ/D2Po60XhYRi+yMXsBf96L98r8Iidg==", "09178a02-6cc8-4aa1-9344-e81e049895d0" });
        }
    }
}
