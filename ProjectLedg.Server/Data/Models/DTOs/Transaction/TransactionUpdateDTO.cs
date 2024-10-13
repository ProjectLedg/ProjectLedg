namespace ProjectLedg.Server.Data.Models.DTOs.Transaction
{
    public class TransactionUpdateDTO
    {
        public int Id { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public DateTime TransactionDate { get; set; }
        public int BasAccountId { get; set; }
    }
}
