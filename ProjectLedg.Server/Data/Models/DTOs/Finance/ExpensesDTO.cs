namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    // Expenses
    public class ExpensesDTO
    {
        public decimal TotalExpenses { get; set; }
        public int ChangePercentage { get; set; } // Month over month (MoM%)

        public List<ExpensesHistoryDTO>? ExpensesHistory { get; set; } // All months to date of this fiscal year
    }

    public class ExpensesHistoryDTO
    {
        public string Month { get; set; }
        public decimal MonthExpenses { get; set; }
    }
}
