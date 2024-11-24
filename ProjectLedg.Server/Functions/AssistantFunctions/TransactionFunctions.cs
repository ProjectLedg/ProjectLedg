using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;

namespace ProjectLedg.Server.Services.AssistantFunctions
{
    public class TransactionFunctions : ITransactionFunctions
    {
        private readonly ProjectLedgContext _context;
        private readonly ILogger<TransactionFunctions> _logger;

        public TransactionFunctions(ProjectLedgContext context, ILogger<TransactionFunctions> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<string> GetLatestTransactionsForCompany(int companyId, int count = 5)
        {
            //Fetch transactions with related data
            var transactions = await _context.Transactions
                .Include(t => t.BasAccount) //Include BasAccount for additional info
                .Where(t => t.CompanyId == companyId)
                .OrderByDescending(t => t.TransactionDate)
                .Take(count)
                .ToListAsync();

            if (!transactions.Any())
                return $"Inga transaktioner hittades för företaget med ID: {companyId}.";

            // Format the transactions
            var formattedTransactions = transactions.Select((t, index) =>
                $"{index + 1}. **Datum:** {t.TransactionDate:yyyy-MM-dd}\n" +
                $"   - **Beskrivning:** {t.BasAccount?.Description ?? "Ingen beskrivning"}\n" +
                $"   - **BAS konto:** {t.BasAccount?.AccountNumber ?? "Okänt konto"}\n" +
                $"   - **Belopp:** {t.Amount:C}");

            return $"Absolut! Här är de senaste {count} transaktionerna för företaget med ID: {companyId}:\n\n" +
                   string.Join("\n\n", formattedTransactions);
        }

        public async Task<string> GetHighProfileTransactionsForCompany(int companyId, decimal threshold = 10000)
        {
            try
            {
                var company = await _context.Companies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == companyId);

                if (company == null)
                {
                    return $"Företaget med ID: {companyId} hittades inte.";
                }

                var transactions = await _context.Transactions
                    .Include(t => t.BasAccount)
                    .AsNoTracking()
                    .Where(t => t.CompanyId == companyId && t.Amount >= threshold)
                    .OrderByDescending(t => t.Amount)
                    .ToListAsync();

                if (!transactions.Any())
                {
                    return $"Inga hög-profilerade transaktioner hittades för företaget '{company.CompanyName}' med över {threshold:C}.";
                }

                var formattedTransactions = transactions.Select((t, index) =>
                    $"{index + 1}. **Datum:** {t.TransactionDate:yyyy-MM-dd}\n" +
                    $"   - **Beskrivning:** {t.BasAccount?.Description ?? "Ingen beskrivning"}\n" +
                    $"   - **BAS konto:** {t.BasAccount?.AccountNumber ?? "Okänt konto"}\n" +
                    $"   - **Belopp:** {t.Amount:C}");

                return $"Högprofilerade transaktioner för företaget '{company.CompanyName}' (Total >= {threshold:C}):\n\n" +
                       string.Join("\n\n", formattedTransactions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ett fel inträffade vid hämtning av högprofilerade transaktioner för företag med ID: {CompanyId}.", companyId);
                return "Ett internt fel inträffade vid bearbetning av din förfrågan. Försök igen senare.";
            }
        }
        public async Task<List<Transaction>> GetHighProfileTransactions(int companyId, decimal threshold = 10000)
        {
            return await _context.Transactions
                .Include(t => t.BasAccount)
                .Where(t => t.CompanyId == companyId && t.Amount >= threshold)
                .OrderByDescending(t => t.Amount)
                .ToListAsync();
        }
    }
}
