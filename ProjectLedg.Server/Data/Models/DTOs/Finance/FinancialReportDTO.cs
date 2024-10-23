namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class FinancialReportDTO
    {
        public List<FinancialDataDTO> FinancialData { get; set; }
        public List<BalanceDataDTO> BalanceData { get; set; }
        public List<ResultDataDTO> ResultData { get; set; }
    }

    public class FinancialDataDTO
    {
        public string Title { get; set; } // Ex: Total Assets
        public decimal Amount { get; set; } // Ex: 180 000
        public string Change { get; set; } // Ex: 5 (5% QoQ)
        public string ChangeType { get; set; } // positive / negative
    }

    public class BalanceDataDTO
    {
        public string Date { get; set; } // Ex: 2023-Q1
        public decimal Assets { get; set; }
        public decimal Liabilities { get; set; }
    }

    public class ResultDataDTO
    {
        public string MonthName { get; set; } 
        public decimal Revenue { get; set; }
        public decimal Expenses { get; set; }
    }
}
