namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class AnnualReportGenerateToPdfDTO
    {
     
        public CompanyInfoDTO Company { get; set; }
        public ResultDispositionDTO ResultDisposition { get; set; }
        public FinancialsDTO Financials { get; set; }
        public EquityAndLiabilitiesDTO EquityAndLiabilities { get; set; }
        public AnualReportRequestDTO AnualReportRequest { get; set; }
    }
   
    

   
}
