using ProjectLedg.Server.Data.Models.DTOs.Invoice;

namespace ProjectLedg.Server.Data.Models.DTOs.BasAccount
{
    public class InvoiceAndBasAccountDto
    {
        public int CompanyId { get; set; }

        public InvoiceDTO Invoice { get; set; }

        public List<BasAccountDTO> Accounts { get; set; }

    }

    public class BasAccountDTO
    {
        public string BasAccount { get; set; }
        public string Description { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }
}
