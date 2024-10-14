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
        public Task<FinanceFiscalYearDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }

        // Get YTD revenue
        public async Task<FinanceFiscalYearDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto)
        {
            FiscalYear fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.StartDate, financeDto.EndDate);
            
            var monthlyRev = await _financeRepo.GetRevenueHistory(fiscalYear);
            
            List<RevenueHistoryDTO> revHistory = new List<RevenueHistoryDTO>();
            foreach(var rev in monthlyRev)
            {
                revHistory.Add(new RevenueHistoryDTO
                {
                    Month = rev.Month,
                    MonthRevenue = rev.Amount
                });
            }




            RevenueDTO revenue = new RevenueDTO
            {
                TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, fiscalYear),
                RevenueHistory = new
            };



        }

        // Get YTD expenses
        public Task<FinanceFiscalYearDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }


    }
}
