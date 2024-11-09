using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class CompanyIdFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "OutgoingInvoices",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "OutgoingInvoices",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d6d98d85-cf45-4f5d-aa1c-f703df35a45a", "AQAAAAIAAYagAAAAEJGX4cYlfWDttHbVUAdCK+Mtsyzjpcq+lzWQW1bWmYWIxUQCczqtWfA3Vcl/ZXJM0g==", "63e0111a-62c2-48b2-9f4f-26f25de40d43" });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2002,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2004,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2016,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2017,
                column: "CompanyId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2018,
                column: "CompanyId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_OutgoingInvoices_CompanyId",
                table: "OutgoingInvoices",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Companies_CompanyId",
                table: "OutgoingInvoices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Companies_CompanyId",
                table: "OutgoingInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices");

            migrationBuilder.DropIndex(
                name: "IX_OutgoingInvoices_CompanyId",
                table: "OutgoingInvoices");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "OutgoingInvoices");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "OutgoingInvoices",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c84d6a1c-49a3-47e4-8a69-bda6bfb2e8fd", "AQAAAAIAAYagAAAAEApBzng1a3y/xrfgyRFxS6d22dMF+NzHzm9wlML18mtB5XJaeHnU3b8zcc4d9A1TfA==", "1e85e01a-ec25-44e7-9cc1-c785efa62765" });

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }
    }
}
