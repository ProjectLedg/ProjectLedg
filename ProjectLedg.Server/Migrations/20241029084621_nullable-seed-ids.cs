using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class nullableseedids : Migration
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

            migrationBuilder.AlterColumn<int>(
                name: "BasAccountId",
                table: "Transactions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "OutgoingInvoices",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Customer",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "141875ab-b1a7-4914-92f3-2b49f3b03afe", "AQAAAAIAAYagAAAAEPcFl3cDgqrPLm2o1AW8ZzPnxcY/Nlv8xb25OHMqRQKhrDxQjwKupiTL5oIrMWC5SQ==", "d9342cad-65d0-4f9d-bde4-138136651f34" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Companies_CompanyId",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_OutgoingInvoices_Customer_CustomerId",
                table: "OutgoingInvoices");

            migrationBuilder.AlterColumn<int>(
                name: "BasAccountId",
                table: "Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "OutgoingInvoices",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Customer",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "266fc40e-4000-46c8-8dfa-de8a909f1f73", "AQAAAAIAAYagAAAAEDC3aPaXVaCv4H92Ngn7P0iBDw26TYoMvmx0TI/hvhnfbs9L3Y+Ju8CsS/N57tpzVQ==", "d34697c8-77a1-48ff-88c5-41da74915d05" });

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Companies_CompanyId",
                table: "Customer",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OutgoingInvoices_Customer_CustomerId",
                table: "OutgoingInvoices",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
