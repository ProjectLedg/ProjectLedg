using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using System.Net.NetworkInformation;

namespace ProjectLedg.Server.Repositories
{
    public class BasAccountRepo : IBasAccountRepo
    {
        private readonly ProjectLedgContext _context;

        public BasAccountRepo(ProjectLedgContext context)
        {
            _context = context;
        }


        public async Task CreateBasAccountAsync(BasAccount basAccount)
        {
             await _context.BasAccounts.AddAsync(basAccount);
             await _context.SaveChangesAsync(); 
        }

        public async Task CreateBasAccountsFromListAsync(List<BasAccount> basAccounts)
        {
            // Ensure all bas accounts are added and saved within the local context instance
            await _context.BasAccounts.AddRangeAsync(basAccounts);
            await _context.SaveChangesAsync();
        }

        public async Task<BasAccount> GetBasAccountByAccountNumberAsync(string basAccountNumber, int companyId)
        {
            return await _context.BasAccounts
                .Where(ba => ba.CompanyId == companyId && ba.AccountNumber == basAccountNumber)
                .FirstOrDefaultAsync();
        }

        public async Task<List<BasAccount>> GetAllBasAccountsByCompanyIdAsync(int companyId)
        {
            return await _context.BasAccounts
                //.AsNoTracking() // Optional, improves performance if no tracking is needed
                .Where(ba => ba.CompanyId == companyId)
                .ToListAsync();
        }
    }
}
