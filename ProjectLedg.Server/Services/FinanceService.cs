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
        public Task<FinanceFiscalYearDTO> GetYearToDateFinancesAsync(FinanceRequestDTO financeDto)
        {
            // calculate values


            FinanceFiscalYearDTO test = new FinanceFiscalYearDTO
            {
                Revenue = new RevenueDTO
                {
                    //  Add values
                },
                Profit = new ProfitDTO
                {
                    //  Add values
                },
                Expenses = new ExpensesDTO
                {
                    //  Add values
                }
            };


            throw new NotImplementedException();
        }



        // Get YTD profit
        public async Task<ProfitDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get months and their profit
            var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(fiscalYear);

            // Create profit dto with all values
            return new ProfitDTO
            {
                TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, fiscalYear),
                ProfitHistory = monthlyProfit,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
            };
        }

        // Get YTD revenue
        public async Task<RevenueDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);
            
            // Get months and their revenue
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(fiscalYear);
            
            // Put all values together in revenue dto and return
            return new RevenueDTO
            {
                TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, fiscalYear),
                RevenueHistory = monthlyRevenue,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue)
            };
        }

        // Get YTD expenses
        public Task<ExpensesDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }

        private double ValueChangeMonthOverMonth(List<MonthlyTotalDTO> monthList)
        {
            // Needs to be at least 2 data sets to compare
            if (monthList.Count < 2)
                throw new InvalidOperationException("Too few values in list. Need 2 or more values to calculate MoM% change.");

            // Round and convert first and last months value to nearest int
            double finalMonth = (double)Math.Round(monthList.Last().Amount, MidpointRounding.AwayFromZero);
            double initialMonth = (double)Math.Round(monthList.First().Amount, MidpointRounding.AwayFromZero);

            // If the initial month is 0, avoid error by dividing by zero
            if (initialMonth == 0)
                throw new InvalidOperationException("Initial month's revenue is zero, cannot calculate percentage change.");

            // Compound Monthly Growth Rate Formula (CMGR)
            // Gives the average month over month (MoM) growth change %
            // Formula: CMGR = (Final Month Value ÷ Initial Month Value) ^ (1 ÷ # of Months) – 1
            return Math.Pow(finalMonth / initialMonth, 1.0 / (monthList.Count)) - 1;
        }
    }
}
