using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IBasAccountService
    {
        List<BasAccount> GetBasAccounts();

        //statistics
        Task<KeyValuePair<string, int>> GetMostPopularBasAccountAsync();
    }
}
