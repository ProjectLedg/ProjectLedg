using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Data.Models.DTOs.PDF;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IPDFService
    {
        byte[] GenerateAnnualReportPdf();
        byte[] GenerateInvoicePdf(InvoiceDTO invoice);
    }
}
