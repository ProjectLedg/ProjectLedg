namespace ProjectLedg.Server.Data.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string OrganizationNumber { get; set; }
        public string TaxId { get; set; }

        public int CompanyId { get; set; }// Just used for on model creating seed data not necessary to use in actual code
        public virtual ICollection<OutgoingInvoice>? OutgoingInvoices { get; set; }


    }
}
