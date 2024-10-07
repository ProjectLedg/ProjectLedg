using ProjectLedg.Server.Data.Models.DTOs.PDF;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IPDFService
    {
        byte[] GenerateYearlyPdf(IEnumerable<PDFYearDTO> pdf);
    }
}
