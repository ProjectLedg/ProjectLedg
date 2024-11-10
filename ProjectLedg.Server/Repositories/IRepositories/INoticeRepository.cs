using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface INoticeRepository
    {
        Task AddNoticeAsync(Notice notice);
        Task<List<Notice>> GetUserNoticesAsync(string userId);

    }
}
