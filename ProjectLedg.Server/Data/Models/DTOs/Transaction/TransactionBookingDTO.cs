namespace ProjectLedg.Server.Data.Models.DTOs.Transaction
{
    public class TransactionBookingDTO
    {

        // Transaction
        public DateTime TransactionDate { get; set; }
        // Something to identify if it is ingoing or outgoing?


        // Invoice 
        public string VendorOrCustomerName { get; set; } // Vendor name for ingoing / Customer name for outgoing invoices
        public string InvoiceNumber { get; set; }
        public decimal InvoiceTotal { get; set; }

        // Bas account
        public List<BasAccountBookingDTO> BasAccounts { get; set; } = new List<BasAccountBookingDTO>();
    }

    public class BasAccountBookingDTO
    {
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public string Description { get; set; }
        public string AccountNumber { get; set; }
    }
}
