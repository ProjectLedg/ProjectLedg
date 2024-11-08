using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class ASPNETROLES : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "75888c5c-3c4f-4425-ad2e-c40e11c26ea4", "AQAAAAIAAYagAAAAEIkCO95hFauLmlCsqcZHJu8OenkowPZAOR5G2OXd4JnQ8MjgQLJW/gb4Ob18Gzu1Ww==", "d14d851f-b4a9-4d41-ab42-4e9b6749231a" });

            migrationBuilder.InsertData(
                table: "OutgoingInvoices",
                columns: new[] { "Id", "CompanyId", "CustomerId", "DueDate", "InvoiceDate", "InvoiceFilePath", "InvoiceNumber", "InvoiceTotal", "IsBooked", "IsPaid", "PaymentDetails", "TotalTax" },
                values: new object[] { 1, 1, 1, new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "OUT001", 10000.00m, false, true, null, 500.00m });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2002,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2016,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2017,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2018,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { 1, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OutgoingInvoices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "552bc731-2408-4e3b-b320-cfefee157c0d", "AQAAAAIAAYagAAAAEKmbUHNuvMIDfMew6oav5F85aOzzQAiuoto/vWzPgZLLr9VBdIhLswhKUcinn8LKLA==", "1fb732ad-52dc-42dc-b382-45197bdcea9b" });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2002,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2016,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2017,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2018,
                columns: new[] { "CompanyId", "OutgoingInvoiceId" },
                values: new object[] { null, null });
        }
    }
}
