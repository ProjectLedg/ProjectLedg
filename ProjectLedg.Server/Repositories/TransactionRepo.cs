using ProjectLedg.Server.Repositories.IRepositories;
using System.Transactions;

namespace ProjectLedg.Server.Repositories
{
    public class TransactionRepo : ITransactionRepo
    {
        public Task CreateTransactionAsync(Transaction transaction)
        {
            throw new NotImplementedException();
        }
    }
}
