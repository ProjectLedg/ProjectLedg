namespace ProjectLedg.Server.Data.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string OrgNumber { get; set; }
        public int AmountOfEmployees { get; set; }
        public string Address { get; set; }
        public string TaxId { get; set; }
        public string CompanyDescription { get; set; }
        public virtual ICollection<BasAccount>? BasAccounts { get; set; }
        public virtual ICollection<IngoingInvoice>? IngoingInvoices { get; set; }
        public virtual ICollection<Customer>? Customers { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
