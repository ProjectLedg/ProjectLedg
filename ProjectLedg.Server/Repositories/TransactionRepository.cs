using ProjectLedg.Server.Repositories.IRepositories;
using System.Transactions;

namespace ProjectLedg.Server.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        public Task CreateTransactionAsync(Transaction transaction)
        {
            throw new NotImplementedException();
        }
    }
}
