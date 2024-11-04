using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;

namespace ProjectLedg.Server.Services.AssistantFunctions
{
    public class TransactionFunctions : ITransactionFunctions
    {
        private readonly ProjectLedgContext _context;

        public TransactionFunctions(ProjectLedgContext context)
        {
            _context = context;
        }


        public async Task<string> GetLatestTransactionsForCompany(int companyId, int count = 5)
        {
            var transactions = await _context.Transactions
                .Where(t => t.CompanyId == companyId)
                .OrderByDescending(t => t.TransactionDate)
                .Take(count)
                .ToListAsync();

            if (!transactions.Any())
                return $"Inga Transaktioner hittades för Företaget med ID: {companyId}.";

            var transactionsInfo = transactions.Select(t =>
                $"Transaktions ID: {t.Id}: Total: {t.Amount}, Datum: {t.TransactionDate}");

            return $"Senaste {count} transaktioner för företaget med ID: {companyId}:\n" + string.Join("\n", transactionsInfo);
        }

        public async Task<string> GetHighProfileTransactionsForCompany(int companyId, decimal threshold = 10000)
        {
            var transactions = await _context.Transactions
                .Where(t => t.CompanyId == companyId && t.Amount >= threshold)
                .OrderByDescending(t => t.Amount)
                .ToListAsync();

            if (!transactions.Any())
                return $"Inga hög-profilerade transaktioner hittades för företaget med ID: {companyId} med över {threshold} kr.";

            var transactionsInfo = transactions.Select(t =>
                $"Transaktions ID: {t.Id}: Total: {t.Amount}, Datum: {t.TransactionDate}");

            return $"Hög profilerade transaktioner för företaget med ID: {companyId} (Total >= {threshold}kr):\n" + string.Join("\n", transactionsInfo);
        }
    }
}
