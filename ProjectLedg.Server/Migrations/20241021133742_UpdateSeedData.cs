using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2005);

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
                keyValue: 2013);

            //migrationBuilder.AddColumn<string>(
            //    name: "CompanyDescription",
            //    table: "Companies",
            //    type: "nvarchar(max)",
            //    nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "49697bfc-69ae-4cdb-8410-9207829aa2c7", "AQAAAAIAAYagAAAAEKOA+Je3ar7I/SoZXbh/+rchWXYw9V6cHKO5EWB8zt01LuWIomZPregRYiwuwBhERA==", "fa726e9d-5bf3-4888-90e8-5be22d98f1af" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AccountNumber", "Credit", "Debit", "Description" },
                values: new object[] { "1000", 0m, 50000m, "Assets" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AccountNumber", "Credit", "Debit", "Description" },
                values: new object[] { "2000", 25000m, 0m, "Liabilities" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AccountNumber", "Debit", "Description" },
                values: new object[] { "3000", 17550m, "Revenue Account" });

            migrationBuilder.InsertData(
                table: "BasAccounts",
                columns: new[] { "Id", "AccountNumber", "CompanyId", "Credit", "Debit", "Description", "Year" },
                values: new object[,]
                {
                    { 4, "4000", 1, 0m, 4500m, "Material Costs", 2023 },
                    { 5, "5000", 1, 0m, 15000m, "Other External Costs", 2023 },
                    { 6, "6000", 1, 0m, 7000m, "Depreciation Costs", 2023 },
                    { 7, "7000", 1, 0m, 4300m, "Personnel Costs", 2023 },
                    { 8, "8000", 1, 0m, 3000m, "Extraordinary Costs", 2023 }
                });

            //migrationBuilder.UpdateData(
            //    table: "Companies",
            //    keyColumn: "Id",
            //    keyValue: 1,
            //    column: "CompanyDescription",
            //    value: null);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1,
                column: "TotalAmount",
                value: 5750.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2,
                column: "TotalAmount",
                value: 4500.00m);

            migrationBuilder.InsertData(
                table: "Invoices",
                columns: new[] { "Id", "ClientName", "CompanyId", "DueDate", "InvoiceDate", "InvoiceFile", "InvoiceNumber", "IsBooked", "IsOutgoing", "IsPaid", "SenderName", "TotalAmount" },
                values: new object[,]
                {
                    { 3, "Client C", 1, new DateTime(2023, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], "INV003", true, true, true, "Company C", 15000.00m },
                    { 4, "Client D", 1, new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], "INV004", true, true, true, "Company D", 10000.00m },
                    { 5, "Client E", 1, new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new byte[0], "INV005", true, true, true, "Company E", 5000.00m }
                });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                column: "BasAccountId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "InvoiceId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                column: "InvoiceId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "InvoiceId",
                value: 4);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                column: "InvoiceId",
                value: 5);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "InvoiceId",
                value: 5);

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "BasAccountId", "InvoiceId", "IsDebit", "TransactionDate" },
                values: new object[,]
                {
                    { 2014, 15000.00m, 4, 3, true, new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2015, 10000.00m, 5, 4, false, new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2016, 2000.00m, 6, 4, true, new DateTime(2023, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2017, 1000.00m, 7, 5, true, new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2018, 500.00m, 8, 5, true, new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2016);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2017);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2018);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 5);

            //migrationBuilder.DropColumn(
            //    name: "CompanyDescription",
            //    table: "Companies");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "39f9fc9e-6692-49c3-9209-365e7c02f54e", "AQAAAAIAAYagAAAAENHaPuBEZaZtw02CiG/z7yLSb4ommBoXI3THheCfWrLCgGSHotC+XFIWG9x/tpoL7Q==", "c5775ccc-9bd7-45aa-9831-a5dcb5d2b02a" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AccountNumber", "Credit", "Debit", "Description" },
                values: new object[] { "3000", 17550m, 0m, "Revenue Account" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AccountNumber", "Credit", "Debit", "Description" },
                values: new object[] { "4000", 0m, 3500m, "Material Costs" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AccountNumber", "Debit", "Description" },
                values: new object[] { "7000", 4300m, "Personnel Costs" });

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1,
                column: "TotalAmount",
                value: 5000.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2,
                column: "TotalAmount",
                value: 1500.00m);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                column: "BasAccountId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "InvoiceId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                column: "InvoiceId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "InvoiceId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                column: "InvoiceId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "InvoiceId",
                value: 1);

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "BasAccountId", "InvoiceId", "IsDebit", "TransactionDate" },
                values: new object[,]
                {
                    { 2005, 1200.00m, 2, 2, true, new DateTime(2023, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2009, 500.00m, 2, 2, true, new DateTime(2023, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2010, 2000.00m, 1, 1, false, new DateTime(2023, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2013, 300.00m, 2, 2, true, new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }
    }
}
