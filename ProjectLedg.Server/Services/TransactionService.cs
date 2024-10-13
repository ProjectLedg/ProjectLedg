using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Transaction;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IBasAccountRepository _basAccountRepository;

        public TransactionService(ITransactionRepository transactionRepository, IBasAccountRepository basAccountRepository)
        {
            _transactionRepository = transactionRepository;
            _basAccountRepository = basAccountRepository;
        }

        public async Task<TransactionDTO> GetTransactionByIdAsync(int id)
        {
            var transaction = await _transactionRepository.GetTransactionByIdAsync(id);
            return MapToDTO(transaction);
        }

        public async Task<TransactionDTO> CreateTransactionAsync(TransactionCreationDTO dto)
        {
            var transaction = new Transaction
            {
                Debit = dto.Debit,
                Credit = dto.Credit,
                TransactionDate = dto.TransactionDate,
                BasAccount = await _basAccountRepository.GetBasAccountByIdAsync(dto.BasAccountId)
            };

            transaction = await _transactionRepository.CreateTransactionAsync(transaction);
            return MapToDTO(transaction);
        }

        public async Task UpdateTransactionAsync(TransactionUpdateDTO dto)
        {
            var transaction = await _transactionRepository.GetTransactionByIdAsync(dto.Id);
            if (transaction != null)
            {
                transaction.Debit = dto.Debit;
                transaction.Credit = dto.Credit;
                transaction.TransactionDate = dto.TransactionDate;
                transaction.BasAccount = await _basAccountRepository.GetBasAccountByIdAsync(dto.BasAccountId);

                await _transactionRepository.UpdateTransactionAsync(transaction);
            }
        }

        public async Task DeleteTransactionAsync(int id)
        {
            await _transactionRepository.DeleteTransactionAsync(id);
        }

        public async Task<List<TransactionDTO>> GetAllTransactionsAsync()
        {
            var transactions = await _transactionRepository.GetAllTransactionsAsync();
            return transactions.Select(MapToDTO).ToList();
        }

        public decimal CalculateProfitability(List<TransactionDTO> transactions)
        {
            decimal totalIncome = 0;
            decimal totalExpenses = 0;

            var incomeAccounts = Enumerable.Range(3000, 1000).Select(x => x.ToString()).ToList();
            var expenseAccounts = Enumerable.Range(4000, 4000).Select(x => x.ToString()).ToList();

            foreach (var transaction in transactions)
            {
                if (incomeAccounts.Contains(transaction.BasAccount.AccountNumber))
                {
                    totalIncome += transaction.Credit;
                }
                else if (expenseAccounts.Contains(transaction.BasAccount.AccountNumber))
                {
                    totalExpenses += transaction.Debit;
                }
            }

            if (totalIncome == 0) return 0;

            var profitMargin = (totalIncome - totalExpenses) / totalIncome * 100;
            return Math.Max(0, Math.Min(100, (profitMargin / 50) * 100));
        }

        private TransactionDTO MapToDTO(Transaction transaction)
        {
            return new TransactionDTO
            {
                Id = transaction.Id,
                Debit = transaction.Debit,
                Credit = transaction.Credit,
                TransactionDate = transaction.TransactionDate,
                BasAccountId = transaction.BasAccount.Id
            };
        }
    }

}
