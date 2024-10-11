using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class FinanceRepo: IFinanceRepo
    {
        private readonly ProjectLedgContext _context;

        public FinanceRepo(ProjectLedgContext context)
        {
            _context = context;
        }


        // Get YTD profit
        public async Task<decimal> GetYearToDateProfitAsync(int companyId, DateTime startDate, DateTime endDate)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.StartDate >= startDate && fy.EndDate <= endDate)
                .SelectMany(fy => fy.BasAccounts)
                .SumAsync(ba => ba.TotalAmount); // Sum all negative and positive posts 
        }

        // Get YTD revenue
        public async Task<decimal> GetYearToDateRevenueAsync(int companyId, DateTime startDate, DateTime endDate)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.StartDate >= startDate && fy.EndDate <= endDate)
                .SelectMany(fy => fy.BasAccounts)
                .Where(ba => ba.TotalAmount > 0) // All positive posts (revenue)
                .SumAsync(ba => ba.TotalAmount);
        }


        // Get YTD expenses
        public async Task<decimal> GetYearToDateExpensesAsync(int companyId, DateTime startDate, DateTime endDate)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.StartDate >= startDate && fy.EndDate <= endDate)
                .SelectMany(fy => fy.BasAccounts)
                .Where(ba => ba.TotalAmount < 0) // All negative posts (expenses)
                .SumAsync(ba => ba.TotalAmount);   
        }
    }
}
