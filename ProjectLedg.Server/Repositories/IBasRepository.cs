using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using System;

namespace ProjectLedg.Server.Repositories
{
    public class BasAccountRepository : IBasAccountRepository
    {
        private readonly ProjectLedgContext _context;

        public BasAccountRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<BasAccount> GetBasAccountByIdAsync(int id)
        {
            return await _context.BasAccounts.Include(b => b.Transactions).FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BasAccount> CreateBasAccountAsync(BasAccount basAccount)
        {
            _context.BasAccounts.Add(basAccount);
            await _context.SaveChangesAsync();
            return basAccount;
        }

        public async Task UpdateBasAccountAsync(BasAccount basAccount)
        {
            _context.Entry(basAccount).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBasAccountAsync(int id)
        {
            var basAccount = await GetBasAccountByIdAsync(id);
            if (basAccount != null)
            {
                _context.BasAccounts.Remove(basAccount);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<BasAccount>> GetAllBasAccountsAsync()
        {
            return await _context.BasAccounts.Include(b => b.Transactions).ToListAsync();
        }
    }
}
