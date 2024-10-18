namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    // Revenue (income)
    public class RevenueDTO
    {
        public decimal TotalRevenue { get; set; }
        public double ChangePercentage { get; set; } // Month over month (MoM%)

        public List<MonthlyTotalDTO>? RevenueHistory { get; set; } // All months to date of this fiscal year
    }

    //public class RevenueHistoryDTO
    //{
    //    public DateTime Date { get; set; }
    //    public string Month { get; set; }
    //    public decimal Value { get; set; }
    //}
}
