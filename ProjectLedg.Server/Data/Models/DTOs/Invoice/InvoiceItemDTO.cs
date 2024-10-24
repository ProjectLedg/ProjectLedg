namespace ProjectLedg.Server.Data.Models.DTOs.Invoice
{
    public class InvoiceItemDTO
    {
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int Amount { get; set; }
    }
}

