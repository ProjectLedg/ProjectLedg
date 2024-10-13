using ProjectLedg.Server.Data.Models.DTOs.BasAccount;

namespace ProjectLedg.Server.Data.Models.DTOs.Transaction
{
    public class TransactionDTO
    {
        public int Id { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public DateTime TransactionDate { get; set; }
        public int BasAccountId { get; set; }


        public BasAccountDTO BasAccount { get; set; }
    }
}
