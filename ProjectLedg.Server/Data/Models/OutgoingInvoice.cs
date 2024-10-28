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
        public bool IsOutgoing { get; set; }
        public bool IsBooked { get; set; } // If invoice is "bokförd" 

        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerAddressRecipient { get; set; }

        public string? InvoiceFilePath { get; set; }
        public List<InvoiceItems> Items { get; set; } = new List<InvoiceItems>();
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
