using Microsoft.EntityFrameworkCore;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories.IRepositories;

namespace ProjectLedg.Server.Repositories
{
    public class EmailRepository : IEmailRepository
    {
        private readonly ProjectLedgContext _context;


        public EmailRepository(ProjectLedgContext context)
        {
            _context = context;
        }


        public async Task<bool> CreateEmailAsync(EmailList email)
        {
            try {
                _context.Emails.Add(email);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        public async Task<bool> DeleteEmailListAsync(int emailId)
        {
           var emailToDelete = await _context.Emails.FindAsync(emailId);
            if (emailToDelete == null)
            {
                return false;
            }
            _context.Emails.Remove(emailToDelete);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<EmailList>> GetAllEmailListAsync()
        {
            return await _context.Emails.ToListAsync();
        }
    }
}
