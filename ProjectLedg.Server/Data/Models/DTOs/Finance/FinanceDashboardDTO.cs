namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class FinanceFiscalYearDTO
    {
        public RevenueDTO Revenue { get; set; }
        public ProfitDTO Profit { get; set; }
        public ExpensesDTO Expenses { get; set; }
    }

    // Revenue (income)
    public class RevenueDTO
    {
        public decimal TotalRevenue { get; set; }
        public int ChangePercentage { get; set; } // Month over month (MoM%)

        public List<RevenueHistoryDTO>? RevenueHistory { get; set; } // All months to date of this fiscal year
    }

    public class RevenueHistoryDTO
    {
        public string Month { get; set; }
        public decimal MonthRevenue { get; set; }
    }

    // Profit
    public class ProfitDTO
    {
        public decimal TotalProfit { get; set; }
        public int ChangePercentage { get; set; } // Month over month (MoM%)

        public List<ExpensesHistoryDTO>? ProfitHistory { get; set; } // All months to date of this fiscal year
    }

    public class ProfitHistoryDTO
    {
        public string Month { get; set; }
        public decimal MonthProfit { get; set; }
    }

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
