namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IFinanceRepo
    {
        public Task<decimal> GetYearToDateProfitAsync(int companyId, DateTime startDate, DateTime endDate);

        public Task<decimal> GetYearToDateRevenueAsync(int companyId, DateTime startDate, DateTime endDate);

        public Task<decimal> GetYearToDateExpensesAsync(int companyId, DateTime startDate, DateTime endDate);

    }
}
