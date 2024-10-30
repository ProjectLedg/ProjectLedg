using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedmappingoutgoingcustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "54296b91-324a-49e0-b8cf-7f237a2c0119", "AQAAAAIAAYagAAAAEF9PVXe2jC0f8gjtG3kgMNz593XPgxcw7IOyBG/A/nj92A2mCbZhkYLg7M4AqEUV+g==", "58fe77f4-281d-45b8-bca2-1d6ea00ceb3a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f6a0afd8-59bf-4aa1-bcd6-3200f88c5192", "AQAAAAIAAYagAAAAEDLHOTEwamZCIchQMI/tsDbhPagC12HwUDriwMa26wtbL1Mnw8Gi52AbAnqhzAKFbA==", "4a98e2db-e443-4beb-92cb-49cce65344fd" });
        }
    }
}
