using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Services
{
    public class NoticeService : INoticeService
    {
        private readonly INoticeRepository _noticeRepository;

        public NoticeService(INoticeRepository noticeRepository)
        {
            _noticeRepository = noticeRepository;
        }

        public async Task SendNoticeToUserAsync(string userId, string title, string content)
        {
            var notice = new Notice
            {
                UserId = userId,
                Title = title,
                Content = content
            };
            await _noticeRepository.AddNoticeAsync(notice);
        }

        public async Task<List<Notice>> GetUserNoticesAsync(string userId)
        {
            return await _noticeRepository.GetUserNoticesAsync(userId);
        }
    }
}
