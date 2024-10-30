using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedcustomerdbsetremovedisOutgoing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Companies_CompanyId",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Customer_CustomerId",
                table: "OutgoingInvoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "IsOutgoing",
                table: "OutgoingInvoices");

            migrationBuilder.DropColumn(
                name: "IsOutgoing",
                table: "IngoingInvoices");

            migrationBuilder.RenameTable(
                name: "Customer",
                newName: "Customers");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_CompanyId",
                table: "Customers",
                newName: "IX_Customers_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                table: "Customers",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f6a0afd8-59bf-4aa1-bcd6-3200f88c5192", "AQAAAAIAAYagAAAAEDLHOTEwamZCIchQMI/tsDbhPagC12HwUDriwMa26wtbL1Mnw8Gi52AbAnqhzAKFbA==", "4a98e2db-e443-4beb-92cb-49cce65344fd" });

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Companies_CompanyId",
                table: "Customers",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Companies_CompanyId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Customers_CustomerId",
                table: "OutgoingInvoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                table: "Customers");

            migrationBuilder.RenameTable(
                name: "Customers",
                newName: "Customer");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_CompanyId",
                table: "Customer",
                newName: "IX_Customer_CompanyId");

            migrationBuilder.AddColumn<bool>(
                name: "IsOutgoing",
                table: "OutgoingInvoices",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOutgoing",
                table: "IngoingInvoices",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer",
                table: "Customer",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "141875ab-b1a7-4914-92f3-2b49f3b03afe", "AQAAAAIAAYagAAAAEPcFl3cDgqrPLm2o1AW8ZzPnxcY/Nlv8xb25OHMqRQKhrDxQjwKupiTL5oIrMWC5SQ==", "d9342cad-65d0-4f9d-bde4-138136651f34" });

            migrationBuilder.UpdateData(
                table: "IngoingInvoices",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsOutgoing",
                value: true);

            migrationBuilder.UpdateData(
                table: "IngoingInvoices",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsOutgoing",
                value: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Companies_CompanyId",
                table: "Customer",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Customer_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id");
        }
    }
}
