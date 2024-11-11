using ProjectLedg.Server.Data.Models;

namespace ProjectLedg.Server.Services.IServices
{
    public interface INoticeService
    {
        Task SendNoticeToUserAsync(string userId, string title, string content);
        Task<List<Notice>> GetUserNoticesAsync(string userId);
    }
}
