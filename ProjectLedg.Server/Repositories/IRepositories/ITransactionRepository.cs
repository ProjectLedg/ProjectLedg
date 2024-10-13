using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface ITransactionRepository
    {
        Task<Transaction> GetTransactionByIdAsync(int id);
        Task<Transaction> CreateTransactionAsync(Transaction transaction);
        Task UpdateTransactionAsync(Transaction transaction);
        Task DeleteTransactionAsync(int id);
        Task<List<Transaction>> GetAllTransactionsAsync();
    }
}
