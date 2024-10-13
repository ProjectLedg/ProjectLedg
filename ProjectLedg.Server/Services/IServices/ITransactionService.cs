using ProjectLedg.Server.Data.Models.DTOs.Transaction;

namespace ProjectLedg.Server.Services.IServices
{
    public interface ITransactionService
    {
        Task<TransactionDTO> GetTransactionByIdAsync(int id);
        Task<TransactionDTO> CreateTransactionAsync(TransactionCreationDTO dto);
        Task UpdateTransactionAsync(TransactionUpdateDTO dto);
        Task DeleteTransactionAsync(int id);
        Task<List<TransactionDTO>> GetAllTransactionsAsync();
        decimal CalculateProfitability(List<TransactionDTO> transactions);
    }
}
