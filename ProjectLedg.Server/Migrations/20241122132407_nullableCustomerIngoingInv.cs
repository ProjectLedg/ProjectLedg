using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class nullableCustomerIngoingInv : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CustomerName",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerAddressRecipient",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerAddress",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "210c0839-6c1b-4576-875b-e0901aa4ac56", "AQAAAAIAAYagAAAAEC4JwU3noFKne4CJCBrNR0lMzBO28w29Fke5l9GZU3G6JhznLOhPkjiF+sb1FoNwPw==", "a2e15a18-9a8d-468a-810c-f1df76ae9967" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "2",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3f9e3a67-ef67-4647-aad2-00dda4aa8564", "AQAAAAIAAYagAAAAEO8qCT6ycq+xM/DB5HbPC3Kuc5x+tgXH0xmn9AKYxVhX1xQUMMGHpAIjalQ1Djj0FQ==", "6dbae412-173d-4728-8afb-2e5e6b90aaaa" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ee9be7fd-94c9-4558-9385-ca86314f2087", "AQAAAAIAAYagAAAAEOa4m7q8k/8ufc45QERYRAqwjwbqu6OsdngBei3ED5iLwc6iWC1Y0Nfh+tSfhVav+w==", "c10276f3-7ba1-42b0-84f8-3917ae9834bc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CustomerName",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerAddressRecipient",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerAddress",
                table: "IngoingInvoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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
        }
    }
}
