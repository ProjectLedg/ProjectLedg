using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class BasAccountRepository : IBasAccountRepository
    {
        private readonly ProjectLedgContext _context;

        public BasAccountRepository(ProjectLedgContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<KeyValuePair<string, int>> GetMostUsedBasAccountAsync()
        {
            var mostUsedBasAccount = await _context.Transactions
                .GroupBy(t => t.BasAccountId)
                .OrderByDescending(g => g.Count())
                .Select(g => new KeyValuePair<string, int>(g.Key.HasValue ? g.Key.Value.ToString() : "Unknown", g.Count()))
                .FirstOrDefaultAsync();

            return mostUsedBasAccount;
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
                if (string.IsNullOrEmpty(basAccountNumber))
                {
                    throw new ArgumentException("Bas account number cannot be null or empty.", nameof(basAccountNumber));
                }

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

