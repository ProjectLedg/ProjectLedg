using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ProjectLedg.Server.Repositories
{
    public class NoticeRepository : INoticeRepository
    {
        private readonly ProjectLedgContext _context;

        public NoticeRepository(ProjectLedgContext context)
        {
            _context = context;
        }

        public async Task AddNoticeAsync(Notice notice)
        {
            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notice>> GetUserNoticesAsync(string userId)
        {
            return await _context.Notices.Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
        }
    }
}
