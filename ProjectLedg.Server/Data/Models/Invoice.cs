using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace ProjectLedg.Server.Data.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? InvoiceFile { get; set; }
        public string? InvoiceFilePath { get; set; }
        public bool IsPaid { get; set; }
        public bool IsOutgoing { get; set; }
        public string ClientName { get; set; }
        public string SenderName { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
