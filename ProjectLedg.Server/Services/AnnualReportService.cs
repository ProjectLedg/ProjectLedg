using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class AnnualReportService : IAnnualReportService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IFinanceRepo _financeRepository;
        public AnnualReportService(ICompanyRepository companyRepository, IFinanceRepo financeRepository)
        {
            _companyRepository = companyRepository;
            _financeRepository = financeRepository;
        }
        public async Task<AnnualReportContentDTO> GenerateAnnualReportContent(AnualReportRequestDTO dto)
        {
            decimal companyTaxRate = 0.22m;

            var company = await _companyRepository.GetCompanyByIdAsync(dto.CompanyId);

            // Get the current date
            var currentDate = new DateOnly(2023, DateTime.Now.Month, DateTime.Now.Day); // Test for mock data


            // Get year to date profit
            var profit = await _financeRepository.GetYearToDateProfitAsync(dto.CompanyId, currentDate.Year);

            // Get year to date revenue
            var revenue = await _financeRepository.GetYearToDateRevenueAsync(dto.CompanyId, currentDate.Year);

            //Get year to date Moms
            var moms = await _financeRepository.GetYearToDateMomsAsync(dto.CompanyId, currentDate.Year);

            // Get external expenses
            var externalExpenses = await _financeRepository.GetYearToDateExternalExpensesAsync(dto.CompanyId, currentDate.Year);

            //Get staff expenses
            var staffExpenses = await _financeRepository.GetYearToDateStaffExpensesAsync(dto.CompanyId, currentDate.Year);

            // Get Financial Posts
            var financialPost = await _financeRepository.GetFinancialPostsAsync(dto.CompanyId, currentDate.Year);

            //Get Intangible Assets
            var intangibleAssets = await _financeRepository.GetYearToDateIntangibleAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Tangible Assets
            var tangibleAssets = await _financeRepository.GetYearToDateTangibleAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Financial Assets
            var financialAssets = await _financeRepository.GetYearToDateFinacialAssetsAsync(dto.CompanyId, currentDate.Year);

            //Get Current Assets
            var currentAssets = await _financeRepository.GetYearToDateCurrentAssetsAsync(dto.CompanyId, currentDate.Year);

            // Get equity capital
            var equityCapital = await _financeRepository.GetYearToDateCapitalEqutityAsync(dto.CompanyId, currentDate.Year);

            //Get Long Term Liabilities
            var longTermLiabilities = await _financeRepository.GetYearToDateLongTermLiabilitiesAsync(dto.CompanyId, currentDate.Year);

            //Get ShortTerm Liabilities
            var shortTermLiabilities = await _financeRepository.GetYearToDateShortTermLiabilitiesAsync(dto.CompanyId, currentDate.Year);

            return new AnnualReportContentDTO
            {
                Company = new CompanyInfoDTO
                {
                    Name = company.CompanyName,
                    OrganizationNumber = company.OrgNumber,
                    CompanyDescription = company.CompanyDescription,
                    Address = company.Address,
                    FiscalYear = currentDate.Year.ToString(),
                    AnnualMeetingDate = currentDate.ToString(),
                    AmountOfEmployees = company.AmountOfEmployees
                },
                ResultDisposition = new ResultDispositionDTO
                {
                    Profit = profit
                },
                Financials = new FinancialsDTO
                {
                    IncomeStatement = new IncomeStatementDTO
                    {
                        NetRevenue = profit - moms,
                        Revenue = revenue,
                        ExternalExpenses = externalExpenses,
                        StaffExpenses = staffExpenses,
                        FinancialItems = financialPost,
                        ResultAfterFinancialItems = financialPost - profit,
                        TaxOnResult = profit * companyTaxRate,
                        AnnualResult = profit + financialPost - (profit * companyTaxRate)
                    },
                    BalanceSheet = new BalanceSheetDTO
                    {
                        IntangibleAssets = intangibleAssets,
                        TangibeAssets = tangibleAssets,
                        FinancialAssets = financialAssets,
                        TotalFixedAssets = intangibleAssets + tangibleAssets + financialAssets,
                        TotalCurrentAssets = currentAssets.Stock + currentAssets.AccountsReceivable + currentAssets.BankKassa + currentAssets.ShortTermReceivables,
                        TotalAssets = currentAssets.Stock + currentAssets.AccountsReceivable + currentAssets.BankKassa + currentAssets.ShortTermReceivables
                        + intangibleAssets + tangibleAssets + financialAssets,

                        CurrentAssets = new BalanceSheetDTO.CurrentAssetsDTO
                        {
                            Stock = currentAssets.Stock,
                            AccountsReceivable = currentAssets.AccountsReceivable,
                            BankKassa = currentAssets.BankKassa,
                            ShortTermReceivables = currentAssets.ShortTermReceivables
                        }
                    }
                },
                EquityAndLiabilities = new EquityAndLiabilitiesDTO
                {
                    Equity = new EquityDTO
                    {
                        StockCapital = equityCapital.StockCapital,
                        BalancedResult = equityCapital.BalancedResult,
                        YearResult = equityCapital.YearResult,
                        TotalEquity = equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult
                    },
                    Liabilities = new LiabilitiesDTO
                    {
                        TotalLongTermLiabilities = longTermLiabilities,
                        AccountsPayable = shortTermLiabilities.AccountsPayable,
                        ShortTermLoans = shortTermLiabilities.ShortTermLoans,
                        TaxesAndFees = shortTermLiabilities.TaxesAndFees,
                        TotalShortTermLiabilities = shortTermLiabilities.AccountsPayable + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees
                    },
                    TotalEquityAndLiabilities = equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult
                               + longTermLiabilities + shortTermLiabilities.AccountsPayable
                               + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees
                }

            };

        }

        public Task<byte[]> GenerateAnnualReportDpf(AnualReportRequestDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}
