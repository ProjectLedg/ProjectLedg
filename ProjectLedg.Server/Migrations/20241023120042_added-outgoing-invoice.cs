using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedoutgoinginvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_Invoices_InvoiceId",
                table: "InvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Invoices_InvoiceId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.AddColumn<int>(
                name: "OutgoingInvoiceId",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OutgoingInvoiceId",
                table: "InvoiceItems",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TaxId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customer_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "IngoingInvoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvoiceTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    IsOutgoing = table.Column<bool>(type: "bit", nullable: false),
                    IsBooked = table.Column<bool>(type: "bit", nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerAddressRecipient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorAddressRecipient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorTaxId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvoiceFilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngoingInvoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IngoingInvoices_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OutgoingInvoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvoiceTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    IsOutgoing = table.Column<bool>(type: "bit", nullable: false),
                    IsBooked = table.Column<bool>(type: "bit", nullable: false),
                    InvoiceFilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutgoingInvoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OutgoingInvoices_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c326a911-c0e7-463b-b2a9-c10bdfca7350", "AQAAAAIAAYagAAAAEK7PDOQUBnYL73ALELi2kTnGWa0vv248LyC/GJzSSHSkE1MV1L5XizdTQvKUxqJBZg==", "e2eae5e6-6d3e-4e4b-892b-586bd9e52c82" });

            migrationBuilder.UpdateData(
                table: "Companies",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Address", "TaxId" },
                values: new object[] { "Test adress", "1231531432" });

            migrationBuilder.InsertData(
                table: "IngoingInvoices",
                columns: new[] { "Id", "CompanyId", "CustomerAddress", "CustomerAddressRecipient", "CustomerId", "CustomerName", "DueDate", "InvoiceDate", "InvoiceFilePath", "InvoiceNumber", "InvoiceTotal", "IsBooked", "IsOutgoing", "IsPaid", "PaymentDetails", "TotalTax", "VendorAddress", "VendorAddressRecipient", "VendorName", "VendorTaxId" },
                values: new object[,]
                {
                    { 1, 1, "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://localhost:7223", "INV001", 5000.00m, true, true, true, null, 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" },
                    { 2, 1, "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://localhost:7223", "INV002", 5000.00m, true, true, true, "34395139", 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" }
                });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2002,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2005,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2009,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2010,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2013,
                column: "OutgoingInvoiceId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_OutgoingInvoiceId",
                table: "Transactions",
                column: "OutgoingInvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceItems_OutgoingInvoiceId",
                table: "InvoiceItems",
                column: "OutgoingInvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_CompanyId",
                table: "Customer",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_IngoingInvoices_CompanyId",
                table: "IngoingInvoices",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_OutgoingInvoices_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_IngoingInvoices_InvoiceId",
                table: "InvoiceItems",
                column: "InvoiceId",
                principalTable: "IngoingInvoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_OutgoingInvoices_OutgoingInvoiceId",
                table: "InvoiceItems",
                column: "OutgoingInvoiceId",
                principalTable: "OutgoingInvoices",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_IngoingInvoices_InvoiceId",
                table: "Transactions",
                column: "InvoiceId",
                principalTable: "IngoingInvoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_OutgoingInvoices_OutgoingInvoiceId",
                table: "Transactions",
                column: "OutgoingInvoiceId",
                principalTable: "OutgoingInvoices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_IngoingInvoices_InvoiceId",
                table: "InvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_OutgoingInvoices_OutgoingInvoiceId",
                table: "InvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_IngoingInvoices_InvoiceId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_OutgoingInvoices_OutgoingInvoiceId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "IngoingInvoices");

            migrationBuilder.DropTable(
                name: "OutgoingInvoices");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_OutgoingInvoiceId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceItems_OutgoingInvoiceId",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "OutgoingInvoiceId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "OutgoingInvoiceId",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Companies");

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    CustomerAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerAddressRecipient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvoiceFilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvoiceTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsBooked = table.Column<bool>(type: "bit", nullable: false),
                    IsOutgoing = table.Column<bool>(type: "bit", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    PaymentDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    VendorAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorAddressRecipient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorTaxId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invoices_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "579aa6de-478b-48e9-b3af-6d8cc4dad7f1", "AQAAAAIAAYagAAAAEPL0lEp/b5aByq0E042UNNXDIT9UC/QJrBZD4Ol+9NaSg13aqr4yNVFhPappoXwiQg==", "4b329acf-cf30-4b32-911f-9caa173ed3cc" });

            migrationBuilder.InsertData(
                table: "Invoices",
                columns: new[] { "Id", "CompanyId", "CustomerAddress", "CustomerAddressRecipient", "CustomerId", "CustomerName", "DueDate", "InvoiceDate", "InvoiceFilePath", "InvoiceNumber", "InvoiceTotal", "IsBooked", "IsOutgoing", "IsPaid", "PaymentDetails", "TotalTax", "VendorAddress", "VendorAddressRecipient", "VendorName", "VendorTaxId" },
                values: new object[,]
                {
                    { 1, 1, "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://localhost:7223", "INV001", 5000.00m, true, true, true, null, 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" },
                    { 2, 1, "Arenavägen 61", "Hjalmar Stranninge AB", "1", "Hjalmar Stranninge", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://localhost:7223", "INV002", 5000.00m, true, true, true, "34395139", 50.00m, "Arenavägen 61", "Erkan", "Blues Kök & Bar", "59315" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_CompanyId",
                table: "Invoices",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_Invoices_InvoiceId",
                table: "InvoiceItems",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Invoices_InvoiceId",
                table: "Transactions",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
