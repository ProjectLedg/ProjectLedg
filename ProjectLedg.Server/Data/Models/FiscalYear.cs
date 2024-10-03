namespace ProjectLedg.Server.Data.Models
{
    public class FiscalYear
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public virtual ICollection<Invoice>? Invoices { get; set; }
        public virtual ICollection<BasAccount>? BasAccounts { get; set; }
    }
}
