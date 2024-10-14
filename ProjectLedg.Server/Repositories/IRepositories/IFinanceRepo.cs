using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IFinanceRepo
    {
        public Task<decimal> GetYearToDateProfitAsync(int companyId, FiscalYear fiscalYear);

        public Task<decimal> GetYearToDateRevenueAsync(int companyId, FiscalYear fiscalYear);

        public Task<decimal> GetYearToDateExpensesAsync(int companyId, FiscalYear fiscalYear);

        public Task<List<MonthlyTotalDTO>> GetProfitHistory(FiscalYear fiscalYear);

        public Task<List<MonthlyTotalDTO>> GetRevenueHistory(FiscalYear fiscalYear);

        public Task<List<MonthlyTotalDTO>> GetExpensesHistory(FiscalYear fiscalYear);

        public Task<FiscalYear> GetFiscalYearAsync(DateTime startDate,  DateTime endDate);


    }
}
