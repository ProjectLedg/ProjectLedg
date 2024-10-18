    using Microsoft.EntityFrameworkCore;
    using ProjectLedg.Server.Data;
    using ProjectLedg.Server.Data.Models;
    using ProjectLedg.Server.Data.Models.DTOs.Finance;
    using ProjectLedg.Server.Repositories.IRepositories;
    using System.ComponentModel.Design;

    namespace ProjectLedg.Server.Repositories
    {
        public class FinanceRepo : IFinanceRepo
        {
            private readonly ProjectLedgContext _context;

            public FinanceRepo(ProjectLedgContext context)
            {
                _context = context;
            }



            // Get YTD revenue
            public async Task<decimal> GetYearToDateRevenueAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(c => c.BasAccounts)
                    .Where(ba => 
                        ba.Year == year && 
                        EF.Functions.Like(ba.AccountNumber, "3%")) // Filter "Konto klass 3" credit is for revenue
                    .SumAsync(ba => ba.Credit - ba.Debit); // Credit for account class 3
            }


            // Get YTD expenses
            public async Task<decimal> GetYearToDateExpensesAsync(int companyId, int year)
            {
                return await _context.Companies
                     .Where(c => c.Id == companyId)
                     .SelectMany(c => c.BasAccounts)
                     // "Konto klass" 4, 5 , 6 & 7 is" is for expenses
                     .Where(ba => 
                         ba.Year == year && (
                         EF.Functions.Like(ba.AccountNumber, "4%") || // For "material- och varukostnader"
                         EF.Functions.Like(ba.AccountNumber, "5%") || // For "övriga kostnader" 
                         EF.Functions.Like(ba.AccountNumber, "6%") || // For "övriga kostnader"
                         EF.Functions.Like(ba.AccountNumber, "7%"))) // For "personalkostnader´"
                     .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
            }

            // Get YTD profit
            public async Task<decimal> GetYearToDateProfitAsync(int companyId, int year)
            {
                var revenue = await GetYearToDateRevenueAsync(companyId, year);
                var expenses = await GetYearToDateExpensesAsync(companyId, year);

                return revenue - expenses; 
            }
        
            public async Task<List<MonthlyTotalDTO>> GetRevenueHistoryAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(c => c.BasAccounts) // Get all BasAccs for this FY
                    .Where(ba => ba.Year == year && EF.Functions.Like(ba.AccountNumber,"3%"))
                    .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyTotalDTO
                    {
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"), // the months full name ex: January

                        // Set amount to the sum of credit - the sum of debit
                        Amount = 
                        g.Where(t => t.IsDebit == false)
                        .Sum(t => t.Amount) - 
                        g.Where(t => t.IsDebit == true)
                        .Sum(t => t.Amount)

                    })
                    .ToListAsync();
            }

            public async Task<List<MonthlyTotalDTO>> GetProfitHistoryAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                    .Where(ba => ba.Year == year)
                    .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                    .GroupBy(t => new {t.TransactionDate.Year, t.TransactionDate.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyTotalDTO
                    {
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"), // the months full name ex: January

                        // Filter the revenue credit posts and subtract the expenses debit posts
                        Amount =
                        // Calculate revenue by subtracting the account class 3 (revenue) debit from its credit 
                        (((g.Where(t => t.IsDebit == false && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == true && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                            .Sum(t => t.Amount)))
                        // Subtract the revenue from the expenses
                        -
                        // Calculate expenses by subtracting the account classes 4-7 (expenses) debit from their credits
                        ((g.Where(t => t.IsDebit == true && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "4%") || // For "material- och varukostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "5%") || // For "övriga kostnader" 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "6%") || // For "övriga kostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "7%"))) // For "personalkostnader´"
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == false && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "4%") || // For "material- och varukostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "5%") || // For "övriga kostnader" 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "6%") || // For "övriga kostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "7%"))) // For "personalkostnader´"
                            .Sum(t => t.Amount))))
                    })
                    .ToListAsync();
            }

            public async Task<List<MonthlyTotalDTO>> GetExpensesHistoryAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                    .Where(ba =>
                         ba.Year == year && (
                         EF.Functions.Like(ba.AccountNumber,"4%") || // For "material- och varukostnader"
                         EF.Functions.Like(ba.AccountNumber,"5%") || // For "övriga kostnader" 
                         EF.Functions.Like(ba.AccountNumber, "6%") || // For "övriga kostnader"
                         EF.Functions.Like(ba.AccountNumber, "7%"))) // For "personalkostnader´"
                    .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyTotalDTO
                    {
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM"), // the months full name ex: January

                        // Set amount to the sum of credit - the sum of debit
                        Amount = 
                        g.Where(t => t.IsDebit == true).Sum(t => t.Amount) -
                        g.Where(t => t.IsDebit == false).Sum(t => t.Amount)

                    })
                    .ToListAsync();
            }

            // Returns fiscal year entity matching the inputted dates and company
            //public async Task<FiscalYear> GetFiscalYearAsync(int companyId, DateTime startDate, DateTime endDate)
            //{
            //    return await _context.Companies
            //        .Where(c => c.Id == companyId)
            //        .SelectMany(fy => fy.FiscalYears)
            //        .SingleOrDefaultAsync(f => f.StartDate >= startDate && f.EndDate <= endDate);
            //}
        }
    }
