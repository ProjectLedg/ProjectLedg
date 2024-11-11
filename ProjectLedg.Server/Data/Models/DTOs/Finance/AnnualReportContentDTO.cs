namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class AnnualReportContentDTO
    {
        public CompanyInfoDTO Company { get; set; }
        public ResultDispositionDTO ResultDisposition { get; set; }
        public FinancialsDTO Financials { get; set; }       
        public EquityAndLiabilitiesDTO EquityAndLiabilities { get; set; }
      
    }

    public class CompanyInfoDTO
    {
        public string Name { get; set; }
        public string OrganizationNumber { get; set; }
        public string FiscalYear { get; set; }
        public string AnnualMeetingDate { get; set; }
        public string CompanyDescription { get; set; }
        public string Address { get; set; }
        public int AmountOfEmployees { get; set; }
    }

    public class ResultDispositionDTO
    {
        public decimal Profit { get; set; }
    }

    public class FinancialsDTO
    {
        public IncomeStatementDTO IncomeStatement { get; set; }
        public BalanceSheetDTO BalanceSheet { get; set; }
    }

    public class IncomeStatementDTO
    {
        public decimal NetRevenue { get; set; }
        public decimal Revenue { get; set; }
        public decimal ExternalExpenses { get; set; }
        public decimal StaffExpenses { get; set; }
        public decimal FinancialItems { get; set; }
        public decimal ResultAfterFinancialItems { get; set; }
        public decimal TaxOnResult { get; set; }
        public decimal AnnualResult { get; set; }
    }

    public class BalanceSheetDTO
    {
        public decimal IntangibleAssets { get; set; }
        public decimal TangibeAssets { get; set; }
        public decimal FinancialAssets { get; set; }
        public decimal TotalFixedAssets { get; set; }
        public decimal TotalCurrentAssets { get; set; }
        public decimal TotalAssets { get; set; }
        public CurrentAssetsDTO CurrentAssets { get; set; }

        public class CurrentAssetsDTO
        {
            public decimal Stock { get; set; }
            public decimal AccountsReceivable { get; set; }
            public decimal BankKassa { get; set; }
            public decimal ShortTermReceivables { get; set; }
        }
    }
    public class EquityAndLiabilitiesDTO
    {
        public EquityDTO Equity { get; set; }
        public LiabilitiesDTO Liabilities { get; set; }
        public decimal TotalEquityAndLiabilities { get; set; }
    }

    public class EquityDTO
    {
        public decimal StockCapital { get; set; }
        public decimal BalancedResult { get; set; }
        public decimal YearResult { get; set; }
        public decimal TotalEquity { get; set; }
    }

    public class LiabilitiesDTO
    {
        public decimal TotalLongTermLiabilities { get; set; }
        public decimal AccountsPayable { get; set; }
        public decimal ShortTermLoans { get; set; }
        public decimal TaxesAndFees { get; set; }
        public decimal TotalShortTermLiabilities { get; set; }
    }


}
