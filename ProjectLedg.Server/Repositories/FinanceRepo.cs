using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
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
        public async Task<decimal> GetYearToDateProfitAsync(int companyId, FiscalYear fiscalYear)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts)
                .SumAsync(ba => ba.TotalAmount); // Sum all negative and positive posts 
        }

        // Get YTD revenue
        public async Task<decimal> GetYearToDateRevenueAsync(int companyId, FiscalYear fiscalYear)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts)
                .Where(ba => ba.TotalAmount > 0) // All positive posts (revenue)
                .SumAsync(ba => ba.TotalAmount);
        }


        // Get YTD expenses
        public async Task<decimal> GetYearToDateExpensesAsync(int companyId, FiscalYear fiscalYear)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.FiscalYears)
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts)
                .Where(ba => ba.TotalAmount < 0) // All negative posts (expenses)
                .SumAsync(ba => ba.TotalAmount);
        }

        public async Task<List<MonthlyTotalDTO>> GetRevenueHistoryAsync(FiscalYear fiscalYear)
        {
            return await _context.FiscalYears
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                .GroupBy(t =>  t.TransactionDate)
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyTotalDTO
                {
                    MonthName = g.Key.ToString("MMMM"), // Get the months name
                    Date = g.Key,
                    Amount = g.Sum(t => t.Amount) // Summarize the values of the group (month)

                })
                .ToListAsync();
        }

        public async Task<List<MonthlyTotalDTO>> GetProfitHistoryAsync(FiscalYear fiscalYear)
        {
            return await _context.FiscalYears
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                .Where(t => t.Amount > 0) // Filter only positive transactions 
                .GroupBy(t => t.TransactionDate)
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyTotalDTO
                {
                    MonthName = g.Key.ToString("MMMM"), // Get the months name
                    Date = g.Key,
                    Amount = g.Sum(t => t.Amount) // Summarize the values of the group (month)

                })
                .ToListAsync();
        }

        public async Task<List<MonthlyTotalDTO>> GetExpensesHistoryAsync(FiscalYear fiscalYear)
        {
            return await _context.FiscalYears
                .Where(fy => fy.Id == fiscalYear.Id)
                .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                .Where(t => t.Amount < 0) // Filter only negative transactions
                .GroupBy(t => t.TransactionDate)
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyTotalDTO
                {
                    MonthName = g.Key.ToString("MMMM"), // Get the months name
                    Date = g.Key,
                    Amount = g.Sum(t => t.Amount) // Summarize the values of the group (month)

                })
                .ToListAsync();
        }

        // Returns fiscal year entity matching the inputted dates and company
        public async Task<FiscalYear> GetFiscalYearAsync(int companyId, DateTime startDate, DateTime endDate)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(fy => fy.FiscalYears)
                .SingleOrDefaultAsync(f => f.StartDate >= startDate && f.EndDate <= endDate);
        }
    }
}
