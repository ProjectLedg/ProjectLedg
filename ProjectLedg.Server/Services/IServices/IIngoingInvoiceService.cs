using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Invoice;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IIngoingInvoiceService
    {
        Task<IngoingInvoice?> GetIngoingInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<IngoingInvoice>> GetAllIngoingInvoicesAsync();
        Task<IngoingInvoice> CreateIngoingInvoiceAsync(InvoiceDTO invoiceDto);
        Task<bool> UpdateIngoingInvoiceAsync(int invoiceId, InvoiceDTO invoiceDto);
        Task<bool> DeleteIngoingInvoiceAsync(int invoiceId);
        Task<bool> SaveIngoingInvoiceAsync(InvoiceDTO invoiceDto, string tempFilePath, string userId);


        //statistics

        Task<int> GetIngoingInvoicesTodayAsync();
        Task<int> GetIngoingInvoicesThisWeekAsync();
        Task<int> GetIngoingInvoicesThisYearAsync();
    }
}
