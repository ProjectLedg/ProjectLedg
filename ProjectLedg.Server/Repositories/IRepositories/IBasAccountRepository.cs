using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IBasAccountRepository
    {
        Task<BasAccount> GetBasAccountByIdAsync(int id);
        Task<BasAccount> CreateBasAccountAsync(BasAccount basAccount);
        Task UpdateBasAccountAsync(BasAccount basAccount);
        Task DeleteBasAccountAsync(int id);
        Task<List<BasAccount>> GetAllBasAccountsAsync();
    }
}
