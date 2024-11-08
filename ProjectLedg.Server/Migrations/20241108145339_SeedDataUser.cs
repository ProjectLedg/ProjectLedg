using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "ed9392d0-3a90-4b8f-bbf8-0e3c33fb48ae", "1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "faf5b7d6-31a6-4f77-b1ea-440c7fd11c3c", "AQAAAAIAAYagAAAAEKLr8Em4OSnHmdQl8/hf3bBnkV4wIzucSGVgrFrQ6J0EC/RSTIQNOE/k0DhAB0hkGw==", "18673d1f-c5a1-4e81-84a9-c5dd655776e0" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AuthenticatorKey", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "2", 0, "XYZ12345", "6679348d-0c6f-4d82-a7b1-b358acf07de3", "testuser2@example.com", true, "John", "Doe", false, null, "TESTUSER2@EXAMPLE.COM", "TESTUSER2@EXAMPLE.COM", "AQAAAAIAAYagAAAAENqocPSvPA90A1UVkroiBsDRxV/1vIJ6xY9bLPG+Qu87PGqXev1qoFAi7sAWqxLO4A==", null, false, "9873fcdc-bca4-4df8-963b-7773b001fd5a", false, "testuser2@example.com" },
                    { "3", 0, "XYZ12345", "71af6057-c38d-464d-8859-9e5cc728bb30", "testuser3@example.com", true, "John", "Doe", false, null, "TESTUSER3@EXAMPLE.COM", "TESTUSER3@EXAMPLE.COM", "AQAAAAIAAYagAAAAEI1iqFUFFWqoC4QFUXPWSUc8RU1hPAFdrbByJciAP3naGIxlgT545h3TU6nWfrhiXA==", null, false, "1ff57f40-4b56-478f-b8aa-aa5e601fd7c6", false, "testuser3@example.com" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "2ffdbddb-c568-4202-97ad-5528663c0ba8", "2" },
                    { "6c752152-45b8-4fe0-af73-d0c64efae165", "3" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "ed9392d0-3a90-4b8f-bbf8-0e3c33fb48ae", "1" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "2ffdbddb-c568-4202-97ad-5528663c0ba8", "2" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "6c752152-45b8-4fe0-af73-d0c64efae165", "3" });

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8f0ef093-7861-4bdb-a07f-bcfb143ba51d", "AQAAAAIAAYagAAAAEI7KtXucPol/POaBPJ2DZMR9IuCt9wDu+4/ZqSwIH8uiecy4gENiazOjt+NAvCekfw==", "f99d5809-4734-48c0-b080-d4e1c9c9bf41" });
        }
    }
}
