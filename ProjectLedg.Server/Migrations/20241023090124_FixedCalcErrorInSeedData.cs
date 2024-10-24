using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLedg.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixedCalcErrorInSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9fa92307-a647-480e-91e9-0b602472b167", "AQAAAAIAAYagAAAAEHlA6xzz7nHwuU387kgcoRMGB530rsqSaOCoplZ85gHxt6IIFg8ZklzwOvh/koDugQ==", "ed45be2a-f940-4ace-b160-e7e10b65a98c" });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 1,
                column: "Debit",
                value: 12750m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 3000m, 1500m });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 17250m, 0m });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 4,
                column: "Debit",
                value: 4300m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 5,
                column: "Debit",
                value: 2200m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 6,
                column: "Debit",
                value: 2000m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 7,
                column: "Debit",
                value: 1000m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 8,
                column: "Debit",
                value: 500m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 3,
                column: "TotalAmount",
                value: 15800.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 4,
                column: "TotalAmount",
                value: 72000.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 5,
                column: "TotalAmount",
                value: 11250.00m);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                column: "IsDebit",
                value: true);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                column: "IsDebit",
                value: true);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "IsDebit",
                value: true);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 9000.00m, false });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "IsDebit",
                value: true);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 8250.00m, false });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "IsDebit",
                value: true);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014,
                column: "Amount",
                value: 43000.00m);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 2200.00m, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                column: "Debit",
                value: 50000m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 25000m, 0m });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Credit", "Debit" },
                values: new object[] { 0m, 17550m });

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 4,
                column: "Debit",
                value: 4500m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 5,
                column: "Debit",
                value: 15000m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 6,
                column: "Debit",
                value: 7000m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 7,
                column: "Debit",
                value: 4300m);

            migrationBuilder.UpdateData(
                table: "BasAccounts",
                keyColumn: "Id",
                keyValue: 8,
                column: "Debit",
                value: 3000m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 3,
                column: "TotalAmount",
                value: 15000.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 4,
                column: "TotalAmount",
                value: 10000.00m);

            migrationBuilder.UpdateData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 5,
                column: "TotalAmount",
                value: 5000.00m);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2001,
                column: "IsDebit",
                value: false);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2003,
                column: "IsDebit",
                value: false);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2006,
                column: "IsDebit",
                value: false);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2007,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 1800.00m, true });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2008,
                column: "IsDebit",
                value: false);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2011,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 2500.00m, true });

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2012,
                column: "IsDebit",
                value: false);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2014,
                column: "Amount",
                value: 15000.00m);

            migrationBuilder.UpdateData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2015,
                columns: new[] { "Amount", "IsDebit" },
                values: new object[] { 10000.00m, false });
        }
    }
}
