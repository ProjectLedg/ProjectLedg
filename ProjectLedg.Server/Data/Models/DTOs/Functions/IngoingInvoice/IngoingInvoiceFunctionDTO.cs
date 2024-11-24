namespace ProjectLedg.Server.Data.Models.DTOs.Functions.IngoingInvoice
{
    public class IngoingInvoiceFunctionDTO
    {
        public string InvoiceNumber { get; set; }
        public string CompanyName { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal InvoiceTotal { get; set; }
    }
}
