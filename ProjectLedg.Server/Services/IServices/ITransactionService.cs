using ProjectLedg.Server.Data.Models.DTOs.Transaction;

namespace ProjectLedg.Server.Services.IServices
{
    public interface ITransactionService
    {
        Task<List<TransactionBookingDTO>> GetAllTransactionsForBookingAsync(int companyId);
    }
}
