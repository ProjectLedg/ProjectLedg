﻿    using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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
        public int? OutgoingInvoiceId { get; set; } // FK to the Invoice model
        public int? IngoingInvoiceId { get; set; } // FK to the Invoice model


        // Ignore both nav props when serializing to avoid circular referencing error

        [JsonIgnore]
        public virtual IngoingInvoice? IngoingInvoice { get; set; } // Nav property to Invoice

        [JsonIgnore]
        public virtual OutgoingInvoice? OutgoingInvoice { get; set; } // Nav property to Invoice
    }
}
