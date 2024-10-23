namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class FinanceInsightsYearDTO
    {
        public List<MonthlyTotalDTO> GrossProfit { get; set; }
        public List<MonthlyTotalDTO> OperatingMargin { get; set; }
        public List<MonthlyTotalDTO> CashFlowAnalysis { get; set; }
        public List<MonthlyTotalDTO> GrossMargin { get; set; }
    }
}
