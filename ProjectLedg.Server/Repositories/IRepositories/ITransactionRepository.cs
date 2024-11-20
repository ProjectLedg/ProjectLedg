
using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ITransactionRepository
    {
        Task CreateTransactionAsync(Transaction transaction);
        Task<List<Transaction>> GetAllTransactionsForCompanyAsync(int companyId);
    }
}
