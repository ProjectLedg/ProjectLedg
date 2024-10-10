using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IPDFRepository
    {
        Task SaveInvoiceAsync(Invoice invoice, string pdfFilePath);
        Task<Invoice> GetInvoiceByIdAsync(int id);
    }
}
