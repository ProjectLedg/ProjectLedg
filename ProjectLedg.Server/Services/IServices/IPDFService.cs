using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Data.Models.DTOs.PDF;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IPDFService
    {
        Task<byte[]> GenerateAnnualReportPdf(AnnualReportGenerateToPdfDTO dto);
        Task<byte[]> GenerateInvoicePdf(OutgoingInvoiceGenerationDTO dto);
    }
}
