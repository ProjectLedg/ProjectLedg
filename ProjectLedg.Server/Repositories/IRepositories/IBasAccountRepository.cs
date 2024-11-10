namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IBasAccountRepository
    {
        Task<KeyValuePair<string, int>> GetMostUsedBasAccountAsync();
    }
}
