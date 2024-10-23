using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class DecimalAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "InvoiceItems",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "579aa6de-478b-48e9-b3af-6d8cc4dad7f1", "AQAAAAIAAYagAAAAEPL0lEp/b5aByq0E042UNNXDIT9UC/QJrBZD4Ol+9NaSg13aqr4yNVFhPappoXwiQg==", "4b329acf-cf30-4b32-911f-9caa173ed3cc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Amount",
                table: "InvoiceItems",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0803e5c5-cd9d-44c1-8494-607fe289fba5", "AQAAAAIAAYagAAAAEMfZcuEyLxW4PrEh68O5tdXaAKJMi4MiRbFU5RcxFErxmHk6mDGGIlwVtLMnQtgrdw==", "621f6260-ac34-48e4-8573-acee275da212" });
        }
    }
}
