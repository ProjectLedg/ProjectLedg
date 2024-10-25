using ProjectLedg.Server.Data.Models.DTOs.Invoice;
using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IOutgoingInvoiceService
    {
        Task<OutgoingInvoice?> GetOutgoingInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<OutgoingInvoice>> GetAllOutgoingInvoicesAsync();
        Task<bool> CreateOutgoingInvoiceAsync(InvoiceDTO invoiceDto);
        Task<bool> UpdateOutgoingInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto);
        Task<bool> DeleteOutgoingInvoiceAsync(int invoiceId);
    }
}
