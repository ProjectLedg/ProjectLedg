﻿using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Finance;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IFinanceRepo
    {
        public Task<decimal> GetYearToDateProfitAsync(int companyId, int year);

        public Task<decimal> GetYearToDateRevenueAsync(int companyId, int year);

        public Task<decimal> GetYearToDateExpensesAsync(int companyId, int year);

        public Task<List<MonthlyTotalDTO>> GetProfitHistoryAsync(int companyId, int year);

        public Task<List<MonthlyTotalDTO>> GetRevenueHistoryAsync(int companyId, int year);

        public Task<List<MonthlyTotalDTO>> GetExpensesHistoryAsync(int companyId, int year);

        public Task<int> GetRunningMonthsAsync(int companyId);


        //public Task<FiscalYear> GetFiscalYearAsync(int companyId, DateTime startDate, DateTime endDate);
    }
}
