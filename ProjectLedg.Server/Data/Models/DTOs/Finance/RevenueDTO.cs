namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    // Revenue (income)
    public class RevenueDTO
    {
        public decimal TotalRevenue { get; set; }
        public int ChangePercentage { get; set; } // Month over month (MoM%)

        public List<RevenueHistoryDTO>? RevenueHistory { get; set; } // All months to date of this fiscal year
    }

    public class RevenueHistoryDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal MonthRevenue { get; set; }
    }
}
