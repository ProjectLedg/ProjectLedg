using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IBasAccountRepository
    {
        Task<KeyValuePair<string, int>> GetMostUsedBasAccountAsync();
        Task CreateBasAccountAsync(BasAccount basAccount);
        Task CreateBasAccountsFromListAsync(List<BasAccount> basAccounts);
        Task<BasAccount> GetBasAccountByAccountNumberAsync(string BasAccountNumber, int companyId);
        Task<List<BasAccount>> GetAllBasAccountsByCompanyIdAsync(int companyId);
    }
}
