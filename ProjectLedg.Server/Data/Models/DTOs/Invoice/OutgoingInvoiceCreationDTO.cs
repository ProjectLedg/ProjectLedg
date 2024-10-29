namespace ProjectLedg.Server.Data.Models.DTOs.Invoice
{
    public class OutgoingInvoiceCreationDTO
    {
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal InvoiceTotal { get; set; }
        public List<InvoiceItemDTO> Items { get; set; } = new List<InvoiceItemDTO>();
        public string? PaymentDetails { get; set; }
        public decimal TotalTax { get; set; }
       

        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerOrgNumber { get; set; }
        public string CustomerTaxId { get; set; }
    }
}
