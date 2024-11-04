    using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using ProjectLedg.Server.Data;
    using ProjectLedg.Server.Data.Models;
    using ProjectLedg.Server.Data.Models.DTOs.Finance;
    using ProjectLedg.Server.Repositories.IRepositories;
    using System.ComponentModel.Design;
using System.Globalization;

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

            public async Task<decimal> GetYearToDateMomsAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(c => c.BasAccounts)
                    .Where(ba =>
                        ba.Year == year &&
                        EF.Functions.Like(ba.AccountNumber, "26%")) // Filter "Konto klass 26" credit is for revenue
                    .SumAsync(ba => ba.Credit - ba.Debit); // Credit for account class 26
            }

        // Get YTD expenses
        public async Task<decimal> GetYearToDateExpensesAsync(int companyId, int year)
            {
                return await _context.Companies
                     .Where(c => c.Id == companyId)
                     .SelectMany(c => c.BasAccounts)
                     .Where(ba => 
                         ba.Year == year && (
                         // "Konto klass" 4, 5 , 6 & 7 is" is for expenses
                         EF.Functions.Like(ba.AccountNumber, "4%") || // For "material- och varukostnader"
                         EF.Functions.Like(ba.AccountNumber, "5%") || // For "övriga kostnader" 
                         EF.Functions.Like(ba.AccountNumber, "6%") || // For "övriga kostnader"
                         EF.Functions.Like(ba.AccountNumber, "7%"))) // For "personalkostnader´"
                     .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
            }

            public async Task<decimal> GetYearToDateExternalExpensesAsync(int companyId, int year)
            {
            return await _context.Companies
                  .Where(c => c.Id == companyId)
                  .SelectMany(c => c.BasAccounts)
                  .Where(ba =>
                      ba.Year == year && (
                      // "Konto klass" 4, 5 , 6 & 7 is" is for expenses
                       
                      EF.Functions.Like(ba.AccountNumber, "5%") || // For "övriga kostnader" 
                      EF.Functions.Like(ba.AccountNumber, "6%"))) // For "personalkostnader´"
                  .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
            }


        public async Task<decimal> GetFinancialPostsAsync(int companyId, int year)
        {
            // Hämta summan av finansiella poster (intäkter minus kostnader)
            var financialIncome = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "83%")) // Finansiella intäkter
                .SumAsync(ba => ba.Debit); // Summa av debet för finansiella intäkter

            var financialExpenses = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "84%")) // Finansiella kostnader
                .SumAsync(ba => ba.Credit); // Summa av kredit för finansiella kostnader

            // Returnera skillnaden mellan intäkter och kostnader
            return financialIncome - financialExpenses;
        }




        // Get YTD profit
        public async Task<decimal> GetYearToDateProfitAsync(int companyId, int year)
            {
                var revenue = await GetYearToDateRevenueAsync(companyId, year);
                var expenses = await GetYearToDateExpensesAsync(companyId, year);

                return revenue - expenses; 
            }

            public async Task<List<MonthlyTotalDTO>> GetYearToDateAssetsHistoryAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(c => c.BasAccounts)
                    .Where(ba =>
                        ba.Year == year &&
                        EF.Functions.Like(ba.AccountNumber, "1%"))
                    .SelectMany(ba => ba.Transactions)
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyTotalDTO
                    {
                        // Sum debit and credit separatly and subtract
                        Amount = 
                        g.Where(t => t.IsDebit == true).Sum(t => t.Amount) - 
                        g.Where(t => t.IsDebit == false).Sum(t => t.Amount),

                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM", new CultureInfo("sv-SE")),
                    })
                    .ToListAsync();
            }

            public async Task<List<MonthlyTotalDTO>> GetYearToDateDebtsHistoryAsync(int companyId, int year)
            {
                return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(c => c.BasAccounts)
                    .Where(ba =>
                        ba.Year == year &&
                        EF.Functions.Like(ba.AccountNumber, "2%"))
                    .SelectMany(ba => ba.Transactions)
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new MonthlyTotalDTO
                    {
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM", new CultureInfo("sv-SE")),

                        Amount = 
                            g.Where(t => t.IsDebit == false).Sum(t => t.Amount) -
                            g.Where(t => t.IsDebit == true).Sum(t => t.Amount)
                    })
                    .ToListAsync();
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
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM", new CultureInfo("sv-SE")),

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
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM", new CultureInfo("sv-SE")), 

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
                        MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM", new CultureInfo("sv-SE")), 

                        // Set amount to the sum of credit - the sum of debit
                        Amount = 
                        g.Where(t => t.IsDebit == true).Sum(t => t.Amount) -
                        g.Where(t => t.IsDebit == false).Sum(t => t.Amount)

                    })
                    .ToListAsync();
            }

        public Task<List<BalanceDataDTO>> GetBalanceData(int companyId, int year)
        {
            throw new NotImplementedException();
        }

        public async Task<int> GetRunningMonthsAsync(int companyId)
        {
            var transactions = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .SelectMany(ba => ba.Transactions)
                .Select(t => t.TransactionDate)
                .ToListAsync();

            if (!transactions.Any())
            {
                return 0; // No transactions found
            }

            var firstTransactionDate = transactions.Min();
            var latestTransactionDate = transactions.Max();

            int monthsDifference = ((latestTransactionDate.Year - firstTransactionDate.Year) * 12) + latestTransactionDate.Month - firstTransactionDate.Month;

            return monthsDifference;


        }

        public async Task<List<MonthlyTotalDTO>> GetGrossProfitHistoryAsync(int companyId, int year)
        {
            return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                    .Where(ba => ba.Year == year)
                    .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
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
                        // Calculate expenses by subtracting the account classes 4 (expenses) debit from their credits
                        ((g.Where(t => t.IsDebit == true && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "4%"))) // For "inköp av varor material´"
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == false && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "4%"))) // For "inköp av varor material´"
                            .Sum(t => t.Amount))))
                    })
                    .ToListAsync();
        }

        public async Task<List<MonthlyTotalDTO>> GetOperatingMarginHistoryAsync(int companyId, int year)
        {
            var monthlyData = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(fy => fy.BasAccounts)
                .Where(ba => ba.Year == year)
                .SelectMany(ba => ba.Transactions)
                .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Where(t => t.IsDebit == false && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                                .Sum(t => t.Amount) -
                              g.Where(t => t.IsDebit == true && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                                .Sum(t => t.Amount),
                    Expenses = g.Where(t => t.IsDebit == true && (
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "4%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "5%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "6%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "7%")))
                                .Sum(t => t.Amount) -
                              g.Where(t => t.IsDebit == false && (
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "4%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "5%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "6%") ||
                                    EF.Functions.Like(t.BasAccount.AccountNumber, "7%")))
                                .Sum(t => t.Amount)
                })
                .ToListAsync();

            var result = monthlyData.Select(data => new MonthlyTotalDTO
            {
                MonthName = new DateTime(data.Year, data.Month, 1).ToString("MMMM"),
                Amount = data.Revenue != 0 ? Math.Round(((data.Revenue - data.Expenses) / data.Revenue) * 100, 1) : 0

            }).ToList();

            return result;
        }


        public async Task<List<MonthlyTotalDTO>> GetCashFlowAnalysisHistoryAsync(int companyId, int year)
        {
            return await _context.Companies
                    .Where(c => c.Id == companyId)
                    .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                    .Where(ba => ba.Year == year)
                    .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                    .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
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
                        ((g.Where(t => t.IsDebit == true && (                             
                             EF.Functions.Like(t.BasAccount.AccountNumber, "5%") || // For "övriga kostnader" 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "6%") || // For "övriga kostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "7%"))) // For "personalkostnader´"
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == false && (                             
                             EF.Functions.Like(t.BasAccount.AccountNumber, "5%") || // For "övriga kostnader" 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "6%") || // For "övriga kostnader"
                             EF.Functions.Like(t.BasAccount.AccountNumber, "7%"))) // For "personalkostnader´"
                            .Sum(t => t.Amount))))

                            +
                           
                        ((g.Where(t => t.IsDebit == false && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "11%") || // For AnnläggningsTillgångar, Maskiner eller fastighet 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "12%") || 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "13%"))) 
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == true && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "11%") || // For AnnläggningsTillgångar, Maskiner eller fastighet 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "12%") || 
                             EF.Functions.Like(t.BasAccount.AccountNumber, "13%"))) 
                            .Sum(t => t.Amount)))

                                +
                           
                        ((g.Where(t => t.IsDebit == false && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "23%")))
                            .Sum(t => t.Amount)) -
                        (g.Where(t => t.IsDebit == true && (
                             EF.Functions.Like(t.BasAccount.AccountNumber, "23%")))
                            .Sum(t => t.Amount)))

                                

                    })
                    .ToListAsync();
        }

        public async Task<List<MonthlyTotalDTO>> GetGrossMarginHistoryAsync(int companyId, int year)
        {
            var monthlyData = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(fy => fy.BasAccounts) // Get all BasAccs for this FY
                .Where(ba => ba.Year == year)
                .SelectMany(ba => ba.Transactions) // Get all transactions for the BasAccs
                .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Where(t => t.IsDebit == false && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                                .Sum(t => t.Amount) -
                              g.Where(t => t.IsDebit == true && EF.Functions.Like(t.BasAccount.AccountNumber, "3%"))
                                .Sum(t => t.Amount),
                    Expenses = g.Where(t => t.IsDebit == true && EF.Functions.Like(t.BasAccount.AccountNumber, "4%"))
                                .Sum(t => t.Amount) -
                              g.Where(t => t.IsDebit == false && EF.Functions.Like(t.BasAccount.AccountNumber, "4%"))
                                .Sum(t => t.Amount)
                })
                .ToListAsync();

            var result = monthlyData.Select(data => new MonthlyTotalDTO
            {
                MonthName = new DateTime(data.Year, data.Month, 1).ToString("MMMM"), // the month's full name ex: January
                Amount = data.Revenue != 0 ? Math.Round(((data.Revenue - data.Expenses) / data.Revenue) * 100, 1) : 0

        }).ToList();

            return result;
        }

        public async Task<decimal> GetYearToDateStaffExpensesAsync(int companyId, int year)
        {
            return await _context.Companies
                  .Where(c => c.Id == companyId)
                  .SelectMany(c => c.BasAccounts)
                  .Where(ba =>
                      ba.Year == year && (
                     
                      EF.Functions.Like(ba.AccountNumber, "6%"))) // For "personalkostnader´"
                  .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
        }

        public async Task<decimal> GetYearToDateIntangibleAssetsAsync(int companyId, int year)
        {
            return await _context.Companies
                  .Where(c => c.Id == companyId)
                  .SelectMany(c => c.BasAccounts)
                  .Where(ba =>
                      ba.Year == year && (

                      EF.Functions.Like(ba.AccountNumber, "10%"))) // For "Imateriella tillgångar"
                  .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
        }

        public async Task<decimal> GetYearToDateTangibleAssetsAsync(int companyId, int year)
        {
            return await _context.Companies
                  .Where(c => c.Id == companyId)
                  .SelectMany(c => c.BasAccounts)
                  .Where(ba =>
                      ba.Year == year && (

                      EF.Functions.Like(ba.AccountNumber, "11%"))) // For "Materiella tillgångar"
                  .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
        }

        public async Task<decimal> GetYearToDateFinacialAssetsAsync(int companyId, int year)
        {
            return await _context.Companies
                  .Where(c => c.Id == companyId)
                  .SelectMany(c => c.BasAccounts)
                  .Where(ba =>
                      ba.Year == year && (

                      EF.Functions.Like(ba.AccountNumber, "12%"))) // For "Finansiella tillgångar"
                  .SumAsync(ba => ba.Debit - ba.Credit); // Debit for account classes above
        }


        public async Task<CurrentAssetsDTO> GetYearToDateCurrentAssetsAsync(int companyId, int year)
        {
            // Hämta debitering för varje kategori av omsättningstillgångar
            var stock = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "14%")) // Lager
                .SumAsync(ba => ba.Debit - ba.Credit); // Debet för lager

            var accountsReceivable = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "15%")) // Kundfordringar
                .SumAsync(ba => ba.Debit - ba.Credit); // Debet för kundfordringar

            var bankKassa = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "19%")) // Kassa och bank
                .SumAsync(ba => ba.Debit - ba.Credit); // Debet för kassa och bank

            var shortTermReceivables = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "16%")) // Kortfristiga fordringar
                .SumAsync(ba => ba.Debit - ba.Credit); // Debet för kortfristiga fordringar

            // Skapa och returnera DTO med hämtade värden
            return new CurrentAssetsDTO
            {
                Stock = stock,
                AccountsReceivable = accountsReceivable,
                BankKassa = bankKassa,
                ShortTermReceivables = shortTermReceivables
            };
        }

        public async Task<CapitalEqutityDTO> GetYearToDateCapitalEqutityAsync(int companyId, int year)
        {
            var stock = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "2081")) // AktieKapital
                .SumAsync(ba => ba.Credit - ba.Debit); // Credit för Aktiekapital

            var balancedResult = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "2099")) // Kassa och bank
                .SumAsync(ba => ba.Credit - ba.Debit); // Credit för kassa och bank

            var yearResult = await GetYearToDateProfitAsync(companyId, year);

            return new CapitalEqutityDTO
            {
                StockCapital = stock,
                BalancedResult = balancedResult,
                YearResult = yearResult
            };
        }

        public async Task<decimal> GetYearToDateLongTermLiabilitiesAsync(int companyId, int year)
        {
            return await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "23%")) // Kassa och bank
                .SumAsync(ba => ba.Credit - ba.Debit); // Debet för kassa och bank
        }

        public async Task<ShortTermLiabilitiesDTO> GetYearToDateShortTermLiabilitiesAsync(int companyId, int year)
        {
            var accountPayable = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    EF.Functions.Like(ba.AccountNumber, "244%")) // Leverantörsskulder
                .SumAsync(ba => ba.Credit - ba.Debit); // Credit för leverantörsskulder

            var shortLoans = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                  ba.Year == year &&
                  EF.Functions.Like(ba.AccountNumber, "284%")) // Kortfristiga lån
                .SumAsync(ba => ba.Credit - ba.Debit); // Credit för kortfristiga lån

            var taxFees = await _context.Companies
                .Where(c => c.Id == companyId)
                .SelectMany(c => c.BasAccounts)
                .Where(ba =>
                    ba.Year == year &&
                    (EF.Functions.Like(ba.AccountNumber, "26%") ||
                     EF.Functions.Like(ba.AccountNumber, "27%")))
                .SumAsync(ba => ba.Credit - ba.Debit);

            return new ShortTermLiabilitiesDTO
            {
                AccountsPayable = accountPayable,
                ShortTermLoans = shortLoans,
                TaxesAndFees = taxFees
            };
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
