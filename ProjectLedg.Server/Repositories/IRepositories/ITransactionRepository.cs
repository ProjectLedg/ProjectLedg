using System.Transactions;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ITransactionRepository
    {
        Task CreateTransactionAsync(Transaction transaction);
    }
}
