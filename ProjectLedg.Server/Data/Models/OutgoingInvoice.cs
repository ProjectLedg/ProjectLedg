using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Data.Models
{
    public class OutgoingInvoice
    {
        [Key]
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal InvoiceTotal { get; set; }
        public string? PaymentDetails { get; set; }
        public decimal TotalTax { get; set; }
        public bool IsPaid { get; set; }
        public bool IsBooked { get; set; } // If invoice is "bokförd" 

        public int? CustomerId { get; set; }
        public int? CompanyId { get; set; }// Just used for on model creating seed data not necessary to use in actual code
        public virtual Customer Customer { get; set; }
        public string? InvoiceFilePath { get; set; }
        public virtual List<InvoiceItems> Items { get; set; } = new List<InvoiceItems>();
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual Company Company { get; set; }
    }
}
