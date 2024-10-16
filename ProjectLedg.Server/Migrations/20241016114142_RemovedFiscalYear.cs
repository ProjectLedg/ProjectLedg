using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemovedFiscalYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BasAccounts_FiscalYears_FiscalYearId",
                table: "BasAccounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_FiscalYears_FiscalYearId",
                table: "Invoices");

            migrationBuilder.DropTable(
                name: "FiscalYears");

            migrationBuilder.RenameColumn(
                name: "FiscalYearId",
                table: "Invoices",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Invoices_FiscalYearId",
                table: "Invoices",
                newName: "IX_Invoices_CompanyId");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "BasAccounts",
                newName: "Debit");

            migrationBuilder.RenameColumn(
                name: "FiscalYearId",
                table: "BasAccounts",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_BasAccounts_FiscalYearId",
                table: "BasAccounts",
                newName: "IX_BasAccounts_CompanyId");

            migrationBuilder.AddColumn<bool>(
                name: "IsDebit",
                table: "Transaction",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsBooked",
                table: "Invoices",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Credit",
                table: "BasAccounts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "BasAccounts",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.DropColumn(
                name: "IsDebit",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "IsBooked",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Credit",
                table: "BasAccounts");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "BasAccounts");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Invoices",
                newName: "FiscalYearId");

            migrationBuilder.RenameIndex(
                name: "IX_Invoices_CompanyId",
                table: "Invoices",
                newName: "IX_Invoices_FiscalYearId");

            migrationBuilder.RenameColumn(
                name: "Debit",
                table: "BasAccounts",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "BasAccounts",
                newName: "FiscalYearId");

            migrationBuilder.RenameIndex(
                name: "IX_BasAccounts_CompanyId",
                table: "BasAccounts",
                newName: "IX_BasAccounts_FiscalYearId");

            migrationBuilder.CreateTable(
                name: "FiscalYears",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FiscalYears", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FiscalYears_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FiscalYears_CompanyId",
                table: "FiscalYears",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_BasAccounts_FiscalYears_FiscalYearId",
                table: "BasAccounts",
                column: "FiscalYearId",
                principalTable: "FiscalYears",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_FiscalYears_FiscalYearId",
                table: "Invoices",
                column: "FiscalYearId",
                principalTable: "FiscalYears",
                principalColumn: "Id");
        }
    }
}
