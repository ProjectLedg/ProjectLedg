using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IFinanceService
    {
        public Task<FinanceFiscalYearDTO> GetYearToDateFinancesAsync(FinanceRequestDTO financeDto);
        public Task<ProfitDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto);

        public Task<RevenueDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto);

        public Task<ExpensesDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto);
    }
}
