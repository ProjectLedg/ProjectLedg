using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepo _iFinanceRepo;

        public FinanceService(IFinanceRepo financeRepo)
        {
            _iFinanceRepo = financeRepo;    
        }

        // Get YTD profit, revenue & expenses 
        public Task<decimal> GetYearToDateFinancesAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }



        // Get YTD profit
        public Task<decimal> GetYearToDateProfitAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }

        // Get YTD revenue
        public Task<decimal> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }

        // Get YTD expenses
        public Task<decimal> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }


    }
}
