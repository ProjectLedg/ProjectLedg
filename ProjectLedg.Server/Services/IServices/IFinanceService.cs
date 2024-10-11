using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IFinanceService
    {
        public Task<decimal> GetYearToDateProfitAsync(FinanceRequestDTO financeDto);

        public Task<decimal> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto);

        public Task<decimal> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto);
    }
}
