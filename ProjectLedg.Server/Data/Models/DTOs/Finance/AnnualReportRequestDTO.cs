namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class AnualReportRequestDTO
    {
        public int CompanyId { get; set; }
        public string Signature { get; set; }
        public string SignatureRole { get; set; }

        public decimal profitPercentageToKeep { get; set; }
    }
}
