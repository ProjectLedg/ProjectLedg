namespace ProjectLedg.Server.Data.Models.DTOs
{
    public class InvoiceMapDTO
    {
        public int Id { get; set; }
        public string? AdditionalContext { get; set; } // Ev context sent in from the user to help the AI to categorize the invoice
        public string? InvoiceNumber { get; set; }
        public decimal InvoiceTotal { get; set; }
        public decimal TotalTax { get; set; }
        
        public List<InvoiceMapItemsDTO> Items { get; set; }
    }

    public class InvoiceMapItemsDTO
    {
        public string Description { get; set; }
        public float Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
    }
}
