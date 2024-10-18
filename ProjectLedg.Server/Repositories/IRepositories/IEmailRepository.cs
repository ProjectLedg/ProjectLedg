using ProjectLedg.Server.Data.Models;
namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IEmailRepository
    {

        Task<bool> CreateEmailAsync(EmailList email);
        Task <IEnumerable<EmailList>> GetAllEmailListAsync();
        Task <bool> DeleteEmailListAsync(int emailId);
    }
}
