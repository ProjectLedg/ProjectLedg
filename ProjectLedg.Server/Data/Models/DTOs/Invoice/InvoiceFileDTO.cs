﻿namespace ProjectLedg.Server.Data.Models.DTOs.Invoice
{
    public class InvoiceFileDTO
    {
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal InvoiceTotal { get; set; }
        public List<string?> Items { get; set; }
        public string? PaymentDetails { get; set; }
        public decimal TotalTax { get; set; }
        public bool IsPaid { get; set; }
        public bool IsOutgoing { get; set; }
        public bool IsBooked { get; set; }

        // Customer Information
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerAddressRecipient { get; set; }

        // Vendor Information
        public string VendorName { get; set; }
        public string VendorAddress { get; set; }
        public string VendorAddressRecipient { get; set; }
        public string VendorTaxId { get; set; }

        public string? InvoiceFilePath { get; set; }
    }
}
