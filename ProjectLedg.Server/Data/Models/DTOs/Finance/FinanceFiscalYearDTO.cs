namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class FinanceFiscalYearDTO
    {
        public RevenueDTO Revenue { get; set; }
        public ProfitDTO Profit { get; set; }
        public ExpensesDTO Expenses { get; set; }
        public RunwayDTO Runway { get; set; }
    }
}
