using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class BasAccountRepository : IBasAccountRepository
    {
        private readonly ProjectLedgContext _context;

        public BasAccountRepository(ProjectLedgContext context)
        {
            _context = context;
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

    }
}
