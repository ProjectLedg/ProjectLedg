namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
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
}
