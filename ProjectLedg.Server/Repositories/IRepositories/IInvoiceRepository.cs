using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IInvoiceRepository
    {
        Task<IngoingInvoice?> GetInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<IngoingInvoice>> GetAllInvoicesAsync();
        Task<bool> CreateInvoiceAsync(IngoingInvoice invoice);
        Task<bool> UpdateInvoiceAsync(IngoingInvoice invoice);
        Task<bool> DeleteInvoiceAsync(int invoiceId);
        Task<bool> SaveInvoiceAsync(IngoingInvoice invoice);
    }
}
