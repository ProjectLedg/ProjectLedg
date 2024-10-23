namespace ProjectLedg.Server.Data.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string OrganizationNumber { get; set; }
        public string TaxId { get; set; }

        public virtual ICollection<OutgoingInvoice>? OutgoingInvoices { get; set; }


    }
}
