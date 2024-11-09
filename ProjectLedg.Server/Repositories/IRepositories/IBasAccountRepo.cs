using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IBasAccountRepo
    {
        Task CreateBasAccountAsync(BasAccount basAccount);
    }
}
