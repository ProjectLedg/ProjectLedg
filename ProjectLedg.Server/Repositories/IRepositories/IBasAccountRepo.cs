using ProjectLedg.Server.Data.Models;
using System.ComponentModel.Design;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IBasAccountRepo
    {
        Task CreateBasAccountAsync(BasAccount basAccount);
        Task CreateBasAccountsFromListAsync(List<BasAccount> basAccounts);
        Task<BasAccount> GetBasAccountByAccountNumberAsync(string BasAccountNumber, int companyId);
        Task <List<BasAccount>> GetAllBasAccountsByCompanyIdAsync(int companyId);
    }
}
