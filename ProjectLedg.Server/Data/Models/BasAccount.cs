namespace ProjectLedg.Server.Data.Models
{
    public class BasAccount
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
