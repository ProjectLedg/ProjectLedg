using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BasAccounts_Companies_CompanyId",
                table: "BasAccounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Companies_CompanyId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_BasAccounts_BasAccountId",
                table: "Transaction");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Invoices_InvoiceId",
                table: "Transaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction");

            migrationBuilder.RenameTable(
                name: "Transaction",
                newName: "Transactions");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_InvoiceId",
                table: "Transactions",
                newName: "IX_Transactions_InvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_BasAccountId",
                table: "Transactions",
                newName: "IX_Transactions_BasAccountId");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Invoices",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "BasAccounts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions",
                column: "Id");

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AuthenticatorKey", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "1", 0, "XYZ12345", "40cac00e-5079-41f2-91f5-d50f9b9bd11f", "testuser@example.com", true, "John", "Doe", false, null, "TESTUSER@EXAMPLE.COM", "TESTUSER@EXAMPLE.COM", "AQAAAAIAAYagAAAAEBBi5ItVV4jqlU+AF+oUg49NfkZGvvoF4w5oGN4pn+44QyK349l9dBRe+QOX8PXORg==", null, false, "090312a5-cf7a-44fc-a7af-b02c3a4ff29c", false, "testuser@example.com" });

            migrationBuilder.InsertData(
                table: "Companies",
                columns: new[] { "Id", "AmountOfEmployees", "CompanyName", "OrgNumber" },
                values: new object[] { 1, 10, "Test Company", "1234567890" });

            migrationBuilder.InsertData(
                table: "BasAccounts",
                columns: new[] { "Id", "AccountNumber", "CompanyId", "Credit", "Debit", "Description", "Year" },
                values: new object[,]
                {
                    { 1, "3000", 1, 0m, 17550m, "Revenue Account", 2023 },
                    { 2, "4000", 1, 0m, 3500m, "Material Costs", 2023 },
                    { 3, "7000", 1, 0m, 4300m, "Personnel Costs", 2023 }
                });

            migrationBuilder.InsertData(
                table: "CompanyUser",
                columns: new[] { "CompaniesId", "UsersId" },
                values: new object[] { 1, "1" });

            migrationBuilder.InsertData(
                table: "Invoices",
                columns: new[] { "Id", "ClientName", "CompanyId", "DueDate", "InvoiceDate", "InvoiceFile", "InvoiceNumber", "IsBooked", "IsOutgoing", "IsPaid", "SenderName", "TotalAmount" },
                values: new object[,]
                {
                    { 1, "Client A", 1, new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], "INV001", true, true, true, "Company A", 5000.00m },
                    { 2, "Client B", 1, new DateTime(2023, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], "INV002", false, false, false, "Company B", 1500.00m }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "BasAccountId", "InvoiceId", "IsDebit", "TransactionDate" },
                values: new object[,]
                {
                    { 2001, 5000.00m, 1, 1, false, new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2002, 1500.00m, 2, 2, true, new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2003, 750.00m, 1, 1, false, new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2004, 3000.00m, 1, 2, false, new DateTime(2023, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2005, 1200.00m, 2, 2, true, new DateTime(2023, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2006, 2500.00m, 1, 1, false, new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2007, 1800.00m, 3, 2, true, new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2008, 3000.00m, 1, 1, false, new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2009, 500.00m, 2, 2, true, new DateTime(2023, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2010, 2000.00m, 1, 1, false, new DateTime(2023, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2011, 2500.00m, 3, 2, true, new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2012, 1500.00m, 1, 1, false, new DateTime(2023, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2013, 300.00m, 2, 2, true, new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_BasAccounts_Companies_CompanyId",
                table: "BasAccounts",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Companies_CompanyId",
                table: "Invoices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_BasAccounts_BasAccountId",
                table: "Transactions",
                column: "BasAccountId",
                principalTable: "BasAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Invoices_InvoiceId",
                table: "Transactions",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BasAccounts_Companies_CompanyId",
                table: "BasAccounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Companies_CompanyId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_BasAccounts_BasAccountId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Invoices_InvoiceId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions");

            migrationBuilder.DeleteData(
                table: "CompanyUser",
                keyColumns: new[] { "CompaniesId", "UsersId" },
                keyValues: new object[] { 1, "1" });

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2002);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2005);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2009);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2010);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2013);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Companies",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.RenameTable(
                name: "Transactions",
                newName: "Transaction");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_InvoiceId",
                table: "Transaction",
                newName: "IX_Transaction_InvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_BasAccountId",
                table: "Transaction",
                newName: "IX_Transaction_BasAccountId");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Invoices",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "BasAccounts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BasAccounts_Companies_CompanyId",
                table: "BasAccounts",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Companies_CompanyId",
                table: "Invoices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_BasAccounts_BasAccountId",
                table: "Transaction",
                column: "BasAccountId",
                principalTable: "BasAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Invoices_InvoiceId",
                table: "Transaction",
                column: "InvoiceId",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
