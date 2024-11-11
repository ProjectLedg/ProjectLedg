using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class NoticeNewsLetter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notices", x => x.Id);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notices");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "042e5485-741a-47c3-aff1-0fd77500920b", "AQAAAAIAAYagAAAAEDwJNZzHLHCfhXqX9Z7VZ+rKvUgoSulzzTAvZU/KQCwvBckY2gBhIOz+fSr42cPhqg==", "627813b7-75e4-4874-81e1-8f24a99ff0b1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1b9ff5b8-7db5-4f86-aa10-6a431f26b024", "AQAAAAIAAYagAAAAEAw/ssij2v6XntxtMMuPJnw+xV0e7YuDcXOQrvtt2104Kd1qjD9ir1BnVSQ74ZuuKQ==", "a161d5d2-e063-4a50-9e8c-008374d16082" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "284a6f8a-8ec0-479c-acb8-316778c16dd5", "AQAAAAIAAYagAAAAEJ0ZD/pgw3UsQhLFrfS8cimdeMHA+U4dBdMc8oywaDl8WFllv311N7bDeIra0WyrPg==", "75cbbb70-7140-47dd-b5c8-f606d56c2db9" });
        }
    }
}
