using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IFinanceService
    {
        public Task<FinanceFiscalYearDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto);

        public Task<FinanceFiscalYearDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto);

        public Task<FinanceFiscalYearDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto);
    }
}
