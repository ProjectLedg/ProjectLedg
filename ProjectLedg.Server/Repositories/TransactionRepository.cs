using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;


namespace ProjectLedg.Server.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ProjectLedgContext _context;

        public TransactionRepository(ProjectLedgContext context)
        {
            _context = context;
        }



        public async Task<List<Transaction>> GetAllTransactionsForCompanyAsync(int companyId)
        {
            return await _context.Transactions
                .Include(t => t.BasAccount)
                .Include(t => t.IngoingInvoice)
                .Include(t => t.OutgoingInvoice)
                .Where(t => t.CompanyId == companyId)
                .ToListAsync();
        }
    }
}
