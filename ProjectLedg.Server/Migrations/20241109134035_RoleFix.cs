using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class RoleFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "d186da3d-43f6-4fa5-aa10-0fe6e3115173", "1" },
                    { "fda748ef-79a4-43a1-ab27-f630b2787818", "2" },
                    { "c97af0ce-ca7b-4a19-9c5e-6d09b85af4dd", "3" }
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d969370f-4f96-4d77-a587-fa949f20c90a", "AQAAAAIAAYagAAAAEDlwqdXDfH+3YLcf23vEes5v9RsEgBTtt2EUiL0uR218EvCXDIyZrPDFRoUTYY/Opg==", "5cd8a40e-c4f1-402d-a9fc-b32a80edf3cc" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e952c90c-8736-45b3-a6c4-7f40021af844", "AQAAAAIAAYagAAAAEFkTV39T0WpNlIgMx1b+fhFteTU5iSmb0CwztAfdCxfvOHWQ9Tb22mUZt0xaqfFxFw==", "a919e83e-e75e-4486-9c6f-c3387092eda9" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "36428ea3-2533-43df-a476-539a0c789d00", "AQAAAAIAAYagAAAAEOamnNeo4mwy+DAB0o65PxUdM1+g6zTcyIWD16AIXvrMWBXIUzvgRjtnorDs+ulqkA==", "614e3c40-708e-454e-94f4-a78c50eebef3" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "d186da3d-43f6-4fa5-aa10-0fe6e3115173", "1" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "fda748ef-79a4-43a1-ab27-f630b2787818", "2" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "c97af0ce-ca7b-4a19-9c5e-6d09b85af4dd", "3" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "ed9392d0-3a90-4b8f-bbf8-0e3c33fb48ae", "1" },
                    { "2ffdbddb-c568-4202-97ad-5528663c0ba8", "2" },
                    { "6c752152-45b8-4fe0-af73-d0c64efae165", "3" }
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "faf5b7d6-31a6-4f77-b1ea-440c7fd11c3c", "AQAAAAIAAYagAAAAEKLr8Em4OSnHmdQl8/hf3bBnkV4wIzucSGVgrFrQ6J0EC/RSTIQNOE/k0DhAB0hkGw==", "18673d1f-c5a1-4e81-84a9-c5dd655776e0" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "6679348d-0c6f-4d82-a7b1-b358acf07de3", "AQAAAAIAAYagAAAAENqocPSvPA90A1UVkroiBsDRxV/1vIJ6xY9bLPG+Qu87PGqXev1qoFAi7sAWqxLO4A==", "9873fcdc-bca4-4df8-963b-7773b001fd5a" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "71af6057-c38d-464d-8859-9e5cc728bb30", "AQAAAAIAAYagAAAAEI1iqFUFFWqoC4QFUXPWSUc8RU1hPAFdrbByJciAP3naGIxlgT545h3TU6nWfrhiXA==", "1ff57f40-4b56-478f-b8aa-aa5e601fd7c6" });
        }
    }
}
