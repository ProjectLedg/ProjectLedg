
using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllTransactionsForCompanyAsync(int companyId);
    }
}
