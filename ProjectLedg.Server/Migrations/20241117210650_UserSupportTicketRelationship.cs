using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class UserSupportTicketRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SupportTickets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "32108b8c-7c3b-45ab-ae73-c64b0d352d84", "AQAAAAIAAYagAAAAEJ4rz/JB0HIs6tmL1UIzbBaSFQ03AUbFmnxM8fn2mluFphVfcQObchJmxRjxAf3zmA==", "2987e1bb-43aa-42b5-83c1-278547619d3b" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "42b700d5-2cf0-46bd-88d5-6121af308bc2", "AQAAAAIAAYagAAAAEDomCaB4x9ndeVEWB1Wn1mnyhIx31SxzYzB6HfREIyRkQrkk8n9JanXX2DUdbDsjaQ==", "3ad1ca4f-f181-42ff-898a-ff6ecd1416b2" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b85f581e-db39-4844-9e2f-e420d802d1fb", "AQAAAAIAAYagAAAAEI3o8EdRthgNXVFERLwrO3OFmEZG0M0Tan9slx+BIQR/jvqhIdx8g8U3y3P+HtlOiA==", "241e7fd1-c217-4ab0-a1d0-0a47b6f4b3a2" });

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_UserId",
                table: "SupportTickets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SupportTickets_AspNetUsers_UserId",
                table: "SupportTickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SupportTickets_AspNetUsers_UserId",
                table: "SupportTickets");

            migrationBuilder.DropIndex(
                name: "IX_SupportTickets_UserId",
                table: "SupportTickets");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "SupportTickets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5a76ed09-cad7-4b1c-866d-426cecd22fd3", "AQAAAAIAAYagAAAAEF12E+XiHzHk0+jQrse/V9/pJlOs5o1lyYzyW4hOdNVvqtr1Nwdv4iJPdXah0oSNyw==", "dacc36b2-d3cb-4e9b-adbb-f1a2f1c972ef" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0cddac90-d0d9-4023-a32c-7390556ffeba", "AQAAAAIAAYagAAAAEJaMW9xfo7g+4iBFMUkWaWd0hqy1kPsUd9HEvkgcdd5P1DDrGqUroY/u4oTxVhX22A==", "96cf8c46-3455-4d1d-bb76-87cb58f860f1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "07ff9740-91e7-43c1-a802-a607525d1703", "AQAAAAIAAYagAAAAECEOrlhnluEPKO6CxzpL0N06kJr+0hUbGh2DdRiphn2J6cpYWB1WD++Abpza8Xl7Cw==", "66ac6d3c-a46c-48b0-a680-3ba0754dc4f3" });
        }
    }
}
