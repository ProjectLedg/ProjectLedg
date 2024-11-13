using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IIngoingInvoiceRepository
    {
        Task<IngoingInvoice?> GetIngoingInvoiceByIdAsync(int invoiceId);
        Task<List<IngoingInvoice>> GetAllIngoingInvoicesForCompanyAsync(int companyId);
        Task<IEnumerable<IngoingInvoice>> GetAllIngoingInvoicesAsync();
        Task<IngoingInvoice> CreateIngoingInvoiceAsync(IngoingInvoice invoice);
        Task<bool> UpdateIngoingInvoiceAsync(IngoingInvoice invoice);
        Task<bool> DeleteIngoingInvoiceAsync(int invoiceId);
        Task<bool> SaveIngoingInvoiceAsync(IngoingInvoice invoice);

        //statistics
        Task<int> CountIngoingInvoicesSinceAsync(DateTime startDate);
    }
}
