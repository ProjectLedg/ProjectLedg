using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepo _financeRepo;

        public FinanceService(IFinanceRepo financeRepo)
        {
            _financeRepo = financeRepo;
        }

        // Get YTD profit, revenue & expenses 
        public async Task<FinanceFiscalYearDTO> GetYearToDateFinancesAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year for the company
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Gather monthly finances
            var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(financeDto.CompanyId, financeDto.Year);
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(financeDto.CompanyId, financeDto.Year);
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(financeDto.CompanyId, financeDto.Year);

            return new FinanceFiscalYearDTO
            {
                Revenue = new RevenueDTO
                {
                    TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year),
                    RevenueHistory = monthlyRevenue,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue),
                },
                Profit = new ProfitDTO
                {
                    TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, financeDto.Year),
                    ProfitHistory = monthlyProfit,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
                },
                Expenses = new ExpensesDTO
                {
                    TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year),
                    ExpensesHistory = monthlyExpenses,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses),
                }
            };
        }



        // Get YTD profit
        public async Task<ProfitDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get months and their profit
            var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return profit with total expense amount, months and their expenses historically and the MoM% change
            return new ProfitDTO
            {
                TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, financeDto.Year),
                ProfitHistory = monthlyProfit,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
            };
        }

        // Get YTD revenue
        public async Task<RevenueDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get months and their revenue
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return revenue with total expense amount, months and their expenses historically and the MoM% change
            return new RevenueDTO
            {
                TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year),
                RevenueHistory = monthlyRevenue,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue)
            };
        }

        // Get YTD expenses
        public async Task<ExpensesDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get all months in year and their expenses
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return expenses with total expense amount, months and their expenses historically and the MoM% change
            return new ExpensesDTO
            {
                TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year),
                ExpensesHistory = monthlyExpenses,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses)
            };
        }

            private double ValueChangeMonthOverMonth(List<MonthlyTotalDTO> monthList)
            {
                // Needs to be at least 2 data sets to compare
                if (monthList.Count < 2)
                    return 0;
                    //throw new InvalidOperationException("Too few values in list. Need 2 or more values to calculate MoM% change.");


                // Round and convert first and last months value to nearest int
                double finalMonth = (double)Math.Round(monthList.Last().Amount, MidpointRounding.AwayFromZero);
                double initialMonth = (double)Math.Round(monthList.First().Amount, MidpointRounding.AwayFromZero);

                // If the initial month is 0 avoid error caused by dividing by zero
                if (initialMonth == 0)
                    return 0;
                    //throw new InvalidOperationException("Initial month's revenue is zero, cannot calculate percentage change.");


                try
                {
                    // Compound Monthly Growth Rate Formula (CMGR)
                    // Gives the average month over month (MoM) growth change %
                    // Formula: CMGR = (Final Month Value ÷ Initial Month Value) ^ (1 ÷ # of Months) – 1
                    double cmgr = Math.Pow(finalMonth / initialMonth, 1.0 / (monthList.Count -1)) - 1;

                    // Return converted from decimal to percent and round to no decimals
                    return Math.Round(cmgr * 100);
                }
                catch (Exception)
                {
                    // If any math operation fails, return 0 as the percentage change
                    // CHANGE TO OTHER ERROR VALIDATION IN FUTURE
                    return 0;
                }

            }
    }
}
