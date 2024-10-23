using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class RevisedInvoiceModelForFormRecognizer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InvoiceFile",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "Invoices",
                newName: "TotalTax");

            migrationBuilder.RenameColumn(
                name: "SenderName",
                table: "Invoices",
                newName: "VendorTaxId");

            migrationBuilder.RenameColumn(
                name: "ClientName",
                table: "Invoices",
                newName: "VendorName");

            migrationBuilder.AddColumn<string>(
                name: "CustomerAddress",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerAddressRecipient",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerId",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceFilePath",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InvoiceTotal",
                table: "Invoices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Items",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentDetails",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VendorAddress",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VendorAddressRecipient",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "456f4c50-981e-446f-a7b8-501c04ebef98", "AQAAAAIAAYagAAAAEDSrswPx//TP2Q0nw/FGrbRHN0TmNtnJDRYMZYKqY7wcJj23/xHx1RKoI8sWp3i2Pw==", "40e28b0a-a63d-4bd0-983f-e6440b5f9eec" });

            migrationBuilder.UpdateData(
                table: "Companies",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompanyDescription",
                value: "This is a Company");

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CustomerAddress", "CustomerAddressRecipient", "CustomerId", "CustomerName", "InvoiceFilePath", "InvoiceTotal", "Items", "PaymentDetails", "TotalTax", "VendorAddress", "VendorAddressRecipient", "VendorName", "VendorTaxId" },
                values: new object[] { "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", "https://localhost:7223", 5000.00m, "Öl", "34395139", 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" });

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CustomerAddress", "CustomerAddressRecipient", "CustomerId", "CustomerName", "DueDate", "InvoiceDate", "InvoiceFilePath", "InvoiceTotal", "IsBooked", "IsOutgoing", "IsPaid", "Items", "PaymentDetails", "TotalTax", "VendorAddress", "VendorAddressRecipient", "VendorName", "VendorTaxId" },
                values: new object[] { "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://localhost:7223", 5000.00m, true, true, true, "Öl", "34395139", 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerAddress",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "CustomerAddressRecipient",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "InvoiceFilePath",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "InvoiceTotal",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Items",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PaymentDetails",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "VendorAddress",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "VendorAddressRecipient",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "VendorTaxId",
                table: "Invoices",
                newName: "SenderName");

            migrationBuilder.RenameColumn(
                name: "VendorName",
                table: "Invoices",
                newName: "ClientName");

            migrationBuilder.RenameColumn(
                name: "TotalTax",
                table: "Invoices",
                newName: "TotalAmount");

            migrationBuilder.AddColumn<byte[]>(
                name: "InvoiceFile",
                table: "Invoices",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "39f9fc9e-6692-49c3-9209-365e7c02f54e", "AQAAAAIAAYagAAAAENHaPuBEZaZtw02CiG/z7yLSb4ommBoXI3THheCfWrLCgGSHotC+XFIWG9x/tpoL7Q==", "c5775ccc-9bd7-45aa-9831-a5dcb5d2b02a" });

            migrationBuilder.UpdateData(
                table: "Companies",
                keyColumn: "Id",
                keyValue: 1,
                column: "CompanyDescription",
                value: null);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ClientName", "InvoiceFile", "SenderName", "TotalAmount" },
                values: new object[] { "Client A", new byte[0], "Company A", 5000.00m });

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ClientName", "DueDate", "InvoiceDate", "InvoiceFile", "IsBooked", "IsOutgoing", "IsPaid", "SenderName", "TotalAmount" },
                values: new object[] { "Client B", new DateTime(2023, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], false, false, false, "Company B", 1500.00m });
        }
    }
}
