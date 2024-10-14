namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    // Profit
    public class ProfitDTO
    {
        public decimal TotalProfit { get; set; }
        public double ChangePercentage { get; set; } // Month over month (MoM%)

        public List<MonthlyTotalDTO>? ProfitHistory { get; set; } // All months to date of this fiscal year
    }
}
