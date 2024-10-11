namespace ProjectLedg.Server.Data.Models.DTOs.Finance
{
    public class FinanceRequestDTO
    {
        public int CompanyId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
}
