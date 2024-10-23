    using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Data.Models
{
    public class InvoiceItems
    {
        [Key]
        public int InvoiceItemId { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }

        public int InvoiceId { get; set; } // FK to the Invoice model
        public Invoice Invoice { get; set; } // Nav property to Invoice
    }
}
