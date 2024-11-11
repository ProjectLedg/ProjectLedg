using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class LoginDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginDate",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "LastLoginDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "042e5485-741a-47c3-aff1-0fd77500920b", null, "AQAAAAIAAYagAAAAEDwJNZzHLHCfhXqX9Z7VZ+rKvUgoSulzzTAvZU/KQCwvBckY2gBhIOz+fSr42cPhqg==", "627813b7-75e4-4874-81e1-8f24a99ff0b1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "LastLoginDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1b9ff5b8-7db5-4f86-aa10-6a431f26b024", null, "AQAAAAIAAYagAAAAEAw/ssij2v6XntxtMMuPJnw+xV0e7YuDcXOQrvtt2104Kd1qjD9ir1BnVSQ74ZuuKQ==", "a161d5d2-e063-4a50-9e8c-008374d16082" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "LastLoginDate", "PasswordHash", "SecurityStamp" },
                values: new object[] { "284a6f8a-8ec0-479c-acb8-316778c16dd5", null, "AQAAAAIAAYagAAAAEJ0ZD/pgw3UsQhLFrfS8cimdeMHA+U4dBdMc8oywaDl8WFllv311N7bDeIra0WyrPg==", "75cbbb70-7140-47dd-b5c8-f606d56c2db9" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginDate",
                table: "AspNetUsers");

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
    }
}
