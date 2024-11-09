using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

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
    }
}
