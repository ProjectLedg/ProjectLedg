namespace ProjectLedg.Server.Data.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public DateTime TransactionDate { get; set; }

        public virtual Invoice Invoice { get; set; }
        public virtual BasAccount BasAccount { get; set; }
    }
}
