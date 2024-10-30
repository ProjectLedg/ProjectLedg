using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IOutgoingInvoiceService
    {
        Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync();
        Task<int> CreateOutgoingInvoiceAsync(OutgoingInvoiceCreationDTO invoiceDto, int companyId);
        Task<bool> UpdateOutgoingInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto);
        Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId);
    }
}
