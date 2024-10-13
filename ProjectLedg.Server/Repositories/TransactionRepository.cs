using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using System;

namespace ProjectLedg.Server.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ProjectLedgContext _context;

        public TransactionRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<Transaction> GetTransactionByIdAsync(int id)
        {
            return await _context.Transactions.Include(t => t.BasAccount).FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task UpdateTransactionAsync(Transaction transaction)
        {
            _context.Entry(transaction).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTransactionAsync(int id)
        {
            var transaction = await GetTransactionByIdAsync(id);
            if (transaction != null)
            {
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions.Include(t => t.BasAccount).ToListAsync();
        }
    }
}
