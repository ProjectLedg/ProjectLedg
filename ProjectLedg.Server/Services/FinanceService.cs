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
            var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);
           
            // Gather monthly finances
            var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(fiscalYear);
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(fiscalYear);
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(fiscalYear);


            FinanceFiscalYearDTO fiscalYearFinances = new FinanceFiscalYearDTO
            {
                Revenue = new RevenueDTO
                {
                    TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, fiscalYear),
                    RevenueHistory = monthlyRevenue,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue),
                },
                Profit = new ProfitDTO
                {
                    TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, fiscalYear),
                    ProfitHistory = monthlyProfit,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
                },
                Expenses = new ExpensesDTO
                {
                    TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, fiscalYear),
                    ExpensesHistory = monthlyExpenses,
                    ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses),
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

            // Return profit with total expense amount, months and their expenses historically and the MoM% change
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

            // Return revenue with total expense amount, months and their expenses historically and the MoM% change
            return new RevenueDTO
            {
                TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, fiscalYear),
                RevenueHistory = monthlyRevenue,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue)
            };
        }

        // Get YTD expenses
        public async Task<ExpensesDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get all months in year and their expenses
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(fiscalYear);

            // Return expenses with total expense amount, months and their expenses historically and the MoM% change
            return new ExpensesDTO
            {
                TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, fiscalYear),
                ExpensesHistory = monthlyExpenses,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses)
            };
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
