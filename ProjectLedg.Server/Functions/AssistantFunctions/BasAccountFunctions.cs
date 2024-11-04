using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Functions.AssistantFunctions.IAssistantFunctions;

namespace ProjectLedg.Server.Functions.AssistantFunctions
{
    public class BasAccountFunctions : IBasAccountFunctions
    {
        private readonly ProjectLedgContext _context;

        public BasAccountFunctions(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task<string> HandleGetCompanyBasAccounts(string[] args)
        {
            if (args.Length < 1 || !int.TryParse(args[0], out int companyId))
            {
                return "Vänligen ange ett giltigt företags-ID. Användning: GetCompanyBasAccounts [companyId]";
            }

            return await FetchCompanyBasAccountsAsync(companyId);
        }

        public async Task<string> FetchCompanyBasAccountsAsync(int companyId)
        {
            var company = await _context.Companies
                .Include(c => c.BasAccounts)
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return $"Företaget med ID {companyId} hittades inte.";
            }

            if (company.BasAccounts == null || !company.BasAccounts.Any())
            {
                return $"Jag hittade inga BAS konton för följande företaget: '{company.CompanyName}'.";
            }

            var basAccountsInfo = company.BasAccounts.Select(b =>
                $"Konto: {b.AccountNumber} ({b.Description}): Debet: {b.Debit}, Kredit: {b.Credit}, År: {b.Year}"
            );

            return $"BAS Konton för företag: '{company.CompanyName}':\n" + string.Join("\n", basAccountsInfo);
        }

        public async Task<string> GetCompanyBasAccounts(int companyId)
        {
            var company = await _context.Companies
                .Include(c => c.BasAccounts)
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return $"Företaget med ID {companyId} hittades inte.";
            }

            if (company.BasAccounts == null || !company.BasAccounts.Any())
            {
                return $"Jag hittade inga BAS konton för följande företaget: '{company.CompanyName}'.";
            }

            var basAccountsInfo = company.BasAccounts.Select(b =>
                $"Konto {b.AccountNumber} ({b.Description}): Debet = {b.Debit}, Kredit = {b.Credit}, År = {b.Year}");

            return $"BAS Konton för företag: '{company.CompanyName}':\n" + string.Join("\n", basAccountsInfo);
        }

        public async Task<string> GetPopularBasAccountsForCompany(int companyId)
        {
            var company = await _context.Companies
                .Include(c => c.BasAccounts)
                .FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return $"Företaget med ID {companyId} hittades inte.";
            }
            var popularAccounts = company.BasAccounts
                .OrderByDescending(b => Math.Max(b.Debit, b.Credit))
                .Take(5)  //
                .Select(b => $"Konto: {b.AccountNumber} ({b.Description}): Debet: {b.Debit}, Kredit: {b.Credit}, År: {b.Year}");

            return $"Mest populära BAS konton för företaget: '{company.CompanyName}':\n" + string.Join("\n", popularAccounts);
        }
    }
}
