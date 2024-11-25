using Microsoft.IdentityModel.Tokens;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Finance;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.Globalization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProjectLedg.Server.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository _financeRepo;
        private readonly ILogger<FinanceService> _logger;

        public FinanceService(IFinanceRepository financeRepo, ILogger<FinanceService> logger)
        {
            _financeRepo = financeRepo;
            _logger = logger;
        }

        // Get YTD profit, revenue & expenses 
        public async Task<FinanceFiscalYearDTO> GetYearToDateFinancesAsync(FinanceRequestDTO financeDto)
        {
            try
            {
                _logger.LogInformation("Starting GetYearToDateFinancesAsync for CompanyId: {CompanyId}, Year: {Year}", financeDto.CompanyId, financeDto.Year);

                var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(financeDto.CompanyId, financeDto.Year);
                _logger.LogInformation("Retrieved monthly profit data for CompanyId: {CompanyId}", financeDto.CompanyId);

                var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(financeDto.CompanyId, financeDto.Year);
                _logger.LogInformation("Retrieved monthly revenue data for CompanyId: {CompanyId}", financeDto.CompanyId);

                var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(financeDto.CompanyId, financeDto.Year);
                _logger.LogInformation("Retrieved monthly expenses data for CompanyId: {CompanyId}", financeDto.CompanyId);

                var runwayScore = await CalculateRunway(financeDto.CompanyId, financeDto.Year);
                _logger.LogInformation("Calculated runway score: {RunwayScore}", runwayScore);

                var result = new FinanceFiscalYearDTO
                {
                    Revenue = new RevenueDTO
                    {
                        TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year),
                        RevenueHistory = monthlyRevenue,
                        ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue),
                    },
                    Profit = new ProfitDTO
                    {
                        TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, financeDto.Year),
                        ProfitHistory = monthlyProfit,
                        ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
                    },
                    Expenses = new ExpensesDTO
                    {
                        TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year),
                        ExpensesHistory = monthlyExpenses,
                        ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses),
                    },
                    Runway = new RunwayDTO
                    {
                        Message = runwayScore.Message,
                        Percentage = runwayScore.Percentage,
                        Months = runwayScore.Months,
                    }
                };

                _logger.LogInformation("Successfully created FinanceFiscalYearDTO for CompanyId: {CompanyId}", financeDto.CompanyId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetYearToDateFinancesAsync for CompanyId: {CompanyId}", financeDto.CompanyId);
                throw; // Re-throw to preserve the stack trace for handling at a higher level
            }
        }

        // Get YTD profit
        public async Task<ProfitDTO> GetYearToDateProfitAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get months and their profit
            var monthlyProfit = await _financeRepo.GetProfitHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return profit with total expense amount, months and their expenses historically and the MoM% change
            return new ProfitDTO
            {
                TotalProfit = await _financeRepo.GetYearToDateProfitAsync(financeDto.CompanyId, financeDto.Year),
                ProfitHistory = monthlyProfit,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyProfit),
            };
        }

        // Get YTD revenue
        public async Task<RevenueDTO> GetYearToDateRevenueAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get months and their revenue
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return revenue with total expense amount, months and their expenses historically and the MoM% change
            return new RevenueDTO
            {
                TotalRevenue = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year),
                RevenueHistory = monthlyRevenue,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyRevenue)
            };
        }

        // Get YTD expenses
        public async Task<ExpensesDTO> GetYearToDateExpensesAsync(FinanceRequestDTO financeDto)
        {
            // Get fiscal year entity to be used in YTD calculations
            //var fiscalYear = await _financeRepo.GetFiscalYearAsync(financeDto.CompanyId, financeDto.StartDate, financeDto.EndDate);

            // Get all months in year and their expenses
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Return expenses with total expense amount, months and their expenses historically and the MoM% change
            return new ExpensesDTO
            {
                TotalExpenses = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year),
                ExpensesHistory = monthlyExpenses,
                ChangePercentage = ValueChangeMonthOverMonth(monthlyExpenses)
            };
        }


        // Financial report
        public async Task<FinancialReportDTO> GetFinancialReportAsync(FinanceRequestDTO financeDto)
            {
            // Get current and previous quarter
            int currentQuarter = GetCurrentQuarter();
            int previousQuarter = GetPreviousQuarter(currentQuarter);

            // Replace list with _repo method to get this data

            // Initialize data lists
            var financialData = new List<FinancialDataDTO>();
            var balanceData = new List<BalanceDataDTO>()
            {
                new BalanceDataDTO() { Date = $"{financeDto.Year}-Q1"},
                new BalanceDataDTO() { Date = $"{financeDto.Year}-Q2" },
                new BalanceDataDTO() { Date = $"{financeDto.Year}-Q3" },
                new BalanceDataDTO() { Date = $"{financeDto.Year}-Q4" },
            };


            // ASSETS
            // Create assets data object
            var assetsYTD = await _financeRepo.GetYearToDateAssetsHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Gets assets amount per all 4 quarters (is always 4 items in list)
            var assetsQuarters = ConvertMonthsToQuarters(assetsYTD);;

            // Add assets per quarter to balanceData
            for (int  i = 0; i < 4; i++)
            {
                balanceData[i].Assets = assetsQuarters[i].Amount;
            }

            var assetsData = CreateFinancialData("Totala tillgångar", assetsYTD.Sum(a => a.Amount), assetsQuarters[currentQuarter-1].Amount, assetsQuarters[previousQuarter-1].Amount, "QoQ");
            financialData.Add(assetsData);


            // DEBTS
            // Create debts data object
            var debtsYTD = await _financeRepo.GetYearToDateDebtsHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Gets debt amount per all 4 quarters (is always 4 items in list)
            var debtQuarters = ConvertMonthsToQuarters(debtsYTD);

            var debtsData = CreateFinancialData("Totala skulder", debtsYTD.Sum(d => d.Amount), debtQuarters[currentQuarter-1].Amount, debtQuarters[previousQuarter-1].Amount, "QoQ");

            // Add liabilities per quarter to balanceData
            for (int i = 0; i < 4; i++)
            {
                balanceData[i].Liabilities = debtQuarters[i].Amount;
            }
            financialData.Add(debtsData);


            // REVENUE
            // Create revenue data object
            decimal revenueYTD = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year); // Get this years expenses
            decimal revenueLY = await _financeRepo.GetYearToDateRevenueAsync(financeDto.CompanyId, financeDto.Year -1); // Get last years expenses

            var revenueData = CreateFinancialData("Intäkter", revenueYTD, revenueYTD, revenueLY, "YoY");

            financialData.Add(revenueData);


            // EXPENSES
            // Create expenses data object
            decimal expensesYTD = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year); // Get this years expenses
            decimal expensesLY = await _financeRepo.GetYearToDateExpensesAsync(financeDto.CompanyId, financeDto.Year -1); // Get last years expenses

            var expensesData = CreateFinancialData("Kostnader", expensesYTD, expensesYTD, expensesLY, "YoY");
            
            financialData.Add(expensesData);


            // Return all data in a financial report object
            return new FinancialReportDTO
            {
                FinancialData = financialData,
                BalanceData = balanceData,
                ResultData = await GetResultDataAsync(financeDto)
            };
        }


        public async Task<List<BalanceDataDTO>> GetBalanceDataAsync(FinanceRequestDTO financeDto)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ResultDataDTO>> GetResultDataAsync(FinanceRequestDTO financeDto)
        {
            // Gather monthly finances
            var monthlyRevenue = await _financeRepo.GetRevenueHistoryAsync(financeDto.CompanyId, financeDto.Year);
            var monthlyExpenses = await _financeRepo.GetExpensesHistoryAsync(financeDto.CompanyId, financeDto.Year);

            // Combine both lists into one and group by month, then for each month set the rev and exp amount if any, otherwise 0
            return monthlyRevenue
                .Concat(monthlyExpenses) 
                .GroupBy(x => x.MonthName) 
                .Select(g => new ResultDataDTO
                {
                    MonthName = g.Key,
                    Revenue = monthlyRevenue.FirstOrDefault(r => r.MonthName == g.Key)?.Amount ?? 0,
                    Expenses = monthlyExpenses.FirstOrDefault(e => e.MonthName == g.Key)?.Amount ?? 0,
                })
                .ToList();
        }


        // Helper methods

        // Create financial data object for the financial report
        private FinancialDataDTO CreateFinancialData(string title, decimal amount, decimal currentValue, decimal previousValue, string periodType)
        {

            // If either of the values are 0, hard code change and its type. Avoids divide by 0 error
            if (currentValue == 0 || previousValue == 0)
            {
                    return new FinancialDataDTO
                    {
                        Title = title,
                        Amount = amount,
                        Change = $"Föregående årsdata ej tillgänglig",
                        ChangeType = "Ingen"
                    };
            }

            // Get % change current vs last quarter
            int changePercentage = ValueChangePeriodOverPeriod(currentValue, previousValue);

            // Get if positive or negative QoQ change
            var valueChangeType = SetPositiveOrNegative(changePercentage);

            return new FinancialDataDTO
            {
                Title = title,
                Amount = amount,
                Change = $"{valueChangeType.symbol}{changePercentage}% {periodType}",
                ChangeType = valueChangeType.text
            };
        }


        // Calculate CMGR (Compound Monthly Growth Rate)
        private double ValueChangeMonthOverMonth(List<MonthlyTotalDTO> monthList)
        {
            // Needs to be at least 2 data sets to compare
            if (monthList.Count < 2)
                return 0;
                //throw new InvalidOperationException("Too few values in list. Need 2 or more values to calculate MoM% change.");

            // Round and convert first and last months value to nearest int
            double finalMonth = (double)Math.Round(monthList.Last().Amount, MidpointRounding.AwayFromZero);
            double initialMonth = (double)Math.Round(monthList.First().Amount, MidpointRounding.AwayFromZero);

            // If the initial month is 0 avoid error caused by dividing by zero
            if (initialMonth == 0)
                return 0;
                //throw new InvalidOperationException("Initial month's revenue is zero, cannot calculate percentage change.");

            try
            {
                // Gives the average month over month (MoM) growth change %
                // Formula: CMGR = (Final Month Value ÷ Initial Month Value) ^ (1 ÷ # of Months) – 1
                double cmgr = Math.Pow(finalMonth / initialMonth, 1.0 / (monthList.Count -1)) - 1;

                // Return converted from decimal to percent and round to no decimals
                return Math.Round(cmgr * 100);
            }
            catch (Exception)
            {
                // If any math operation fails, return 0 as the percentage change
                // CHANGE TO OTHER ERROR VALIDATION IN FUTURE
                return 0;
            }

        }

        private int ValueChangePeriodOverPeriod(decimal currentPeriod, decimal lastPeriod)
        {
            return (int)Math.Round(((currentPeriod - lastPeriod) / lastPeriod) * 100, MidpointRounding.AwayFromZero);
        }

        private List<QuarterlyTotalDTO> ConvertMonthsToQuarters(List<MonthlyTotalDTO> monthList)
        {
            QuarterlyTotalDTO quarter1 = new QuarterlyTotalDTO { Amount = 0, Quarter = "Q1" };
            QuarterlyTotalDTO quarter2 = new QuarterlyTotalDTO { Amount = 0, Quarter = "Q2" };
            QuarterlyTotalDTO quarter3 = new QuarterlyTotalDTO { Amount = 0, Quarter = "Q3" };
            QuarterlyTotalDTO quarter4 = new QuarterlyTotalDTO { Amount = 0, Quarter = "Q4" };

            foreach (var month in monthList)
            {
                try
                {
                    // Attempt to parse the month names from Swedish to a datetime object to assure its a valid month
                    DateTime parsedMonth = DateTime.ParseExact(month.MonthName, "MMMM", new CultureInfo("sv-SE"));
                        
                    switch (parsedMonth.Month)
                    {
                        case 1:
                        case 2:
                        case 3:
                            quarter1.Amount += month.Amount;
                            break;
                        case 4:
                        case 5:
                        case 6:
                            quarter2.Amount += month.Amount;
                            break;
                        case 7:
                        case 8:
                        case 9:
                            quarter3.Amount += month.Amount;
                            break;
                        case 10:
                        case 11:
                        case 12:
                            quarter4.Amount += month.Amount;
                            break;
                    }
                }
                catch (FormatException)
                {
                    // Add error handling in the case of where the month name isn't valid
                    Console.WriteLine($"Invalid month name: {month.MonthName}");
                }
            }

            return new List<QuarterlyTotalDTO>()
            {
                quarter1, quarter2, quarter3, quarter4
            };
        }

        private int GetCurrentQuarter()
        {
            int currentMonth = DateTime.Now.Month;

            if (currentMonth >= 1 && currentMonth <= 3)
                return 1;  // Q1 (January, February, March)
            else if (currentMonth >= 4 && currentMonth <= 6)
                return 2;  // Q2 (April, May, June)
            else if (currentMonth >= 7 && currentMonth <= 9)
                return 3;  // Q3 (July, August, September)
            else
                return 4;  // Q4 (October, November, December)
        }

        private int GetPreviousQuarter(int currentQuarter)
        {
            // If Q1 wrap around and return Q4 
            if (currentQuarter == 1)
                return 4;
            else
                return currentQuarter - 1;
        }

        // Returns positive or negative text and symbol depending on value
        private (string text, string symbol) SetPositiveOrNegative(double value)
        {
            string text = string.Empty;
            string symbol = string.Empty;

            if (value >= 0)
            {
                text = "Positiv";
                symbol = "+";
            }
            else if (value < 0)
            {
                text = "Negativ";
                symbol = "-";
            }

            return (text, symbol);
        }


        public async Task<FinanceInsightsYearDTO> GetFinanceInsightsYearAsync(FinanceRequestDTO financeDto)
        {
            try {
                var grossprofit = await _financeRepo.GetGrossProfitHistoryAsync(financeDto.CompanyId, financeDto.Year);
                var operatingMargin = await _financeRepo.GetOperatingMarginHistoryAsync(financeDto.CompanyId, financeDto.Year);
                var cashFlowAnalysis = await _financeRepo.GetCashFlowAnalysisHistoryAsync(financeDto.CompanyId, financeDto.Year);
                var grossMargin = await _financeRepo.GetGrossMarginHistoryAsync(financeDto.CompanyId, financeDto.Year);

                return new FinanceInsightsYearDTO
                {
                    GrossProfit = grossprofit,
                    OperatingMargin = operatingMargin,
                    CashFlowAnalysis = cashFlowAnalysis,
                    GrossMargin = grossMargin
                };

            }
            catch (Exception e)
            {
                
                return new FinanceInsightsYearDTO
                {
                    GrossProfit = new List<MonthlyTotalDTO>(),
                    OperatingMargin = new List<MonthlyTotalDTO>(),
                    CashFlowAnalysis = new List<MonthlyTotalDTO>(),
                    GrossMargin = new List<MonthlyTotalDTO>()
                };
            }

        }

        


        private async Task<RunwayDTO> CalculateRunway(int companyId, int year)
        {
            int runningMonths = await _financeRepo.GetRunningMonthsAsync(companyId);
            if (runningMonths == 0)
            {
                return new RunwayDTO
                {
                    Message = "No data",
                    Percentage = 0,
                    Months = 0
                };
            }

            string status = "";

            // Get values for calculation
            var totalRevenue = await _financeRepo.GetYearToDateRevenueAsync(companyId, year);
            var totalExpenses = await _financeRepo.GetYearToDateExpensesAsync(companyId, year);

            // Calculate Rörelseresultat (EBIT)
            decimal ebit = totalRevenue - totalExpenses;

            // Check if totalRevenue is zero to avoid division by zero
            if (totalRevenue == 0)
            {
                return new RunwayDTO
                {
                    Message = "No revenue data",
                    Percentage = 0,
                    Months = runningMonths
                };
            }

            // Calculate Vinstmarginal
            decimal profitMargin = (ebit / totalRevenue) * 100;

            // Define min and max for profit margin for normalization
            const decimal minimumProfitMargin = 0;
            const decimal maximumProfitMargin = 50;

            // Normalize profit margin
            var normalizedProfitMargin = (profitMargin - minimumProfitMargin) / (maximumProfitMargin - minimumProfitMargin) * 100;

            normalizedProfitMargin = Math.Max(0, Math.Min(normalizedProfitMargin, 100));

            // Calculate runway
            int roundedNormalizedProfitMargin = (int)Math.Round(normalizedProfitMargin);

            if (roundedNormalizedProfitMargin < 30)
            {
                status = "Inte bra!";
            }
            else if (roundedNormalizedProfitMargin >= 30 && roundedNormalizedProfitMargin < 60)
            {
                status = "Bra!";
            }
            else if (roundedNormalizedProfitMargin >= 60)
            {
                status = "Väldigt bra!";
            }

            return new RunwayDTO
            {
                Message = status,
                Percentage = roundedNormalizedProfitMargin,
                Months = runningMonths
            };
        }

    }
}
