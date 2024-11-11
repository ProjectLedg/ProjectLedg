using System.Transactions;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ITransactionRepo
    {
        Task CreateTransactionAsync(Transaction transaction);
    }
}
