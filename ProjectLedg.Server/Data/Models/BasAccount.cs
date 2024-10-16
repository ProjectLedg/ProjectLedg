namespace ProjectLedg.Server.Data.Models
{
    public class BasAccount
    {
        public int Id { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }
        public int Year { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
