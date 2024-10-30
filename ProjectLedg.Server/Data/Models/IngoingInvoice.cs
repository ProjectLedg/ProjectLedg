using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectLedg.Server.Data.Models
{
    public class IngoingInvoice
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

        //Customer Related queries  
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerAddressRecipient { get; set; }

        //Vendor Related queries
        public string VendorName { get; set; }
        public string VendorAddress { get; set; }
        public string VendorAddressRecipient { get; set; }
        public string VendorTaxId { get; set; }

        //Saves the SASed URL of the invoice to the Database
        public string? InvoiceFilePath { get; set; }

        public List<InvoiceItems> Items { get; set; } = new List<InvoiceItems>();

        [ForeignKey("Company")]
        public int CompanyId { get; set; }


        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
