using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IAnnualReportService
    {
        Task<AnnualReportContentDTO> GenerateAnnualReportContent(int companyId);
        Task<byte[]> GenerateAnnualReportDpf(AnualReportRequestDTO dto);
    }
}
