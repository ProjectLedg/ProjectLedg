namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    // Expenses
    public class ExpensesDTO
    {
        public decimal TotalExpenses { get; set; }
        public double ChangePercentage { get; set; } // Month over month (MoM%)

        public List<MonthlyTotalDTO>? ExpensesHistory { get; set; } // All months to date of this fiscal year
    }
}
