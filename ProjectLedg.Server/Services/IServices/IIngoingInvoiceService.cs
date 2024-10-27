using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IIngoingInvoiceService
    {
        Task<IngoingInvoice?> GetInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<IngoingInvoice>> GetAllInvoicesAsync();
        Task<bool> CreateInvoiceAsync(InvoiceDTO invoiceDto);
        Task<bool> UpdateInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto);
        Task<bool> DeleteInvoiceAsync(int invoiceId);
        Task<bool> SaveInvoiceAsync(InvoiceDTO invoiceDto, string tempFilePath, string userId);
    }
}
