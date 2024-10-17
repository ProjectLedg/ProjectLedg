using ProjectLedg.Server.Data.Models.DTOs.Email;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IEmailService
    {
        Task<bool> CreateEmailAsync(EmailDTO dto);
        Task<bool> DeleteEmailAsync(int emailId);
        Task<IEnumerable<EmailDTO>> GetAllEmailsAsync();
    }
}
