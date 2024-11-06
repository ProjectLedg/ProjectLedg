using ProjectLedg.Server.Data.Models.DTOs.Email;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IEmailService
    {
        Task<bool> CreateEmailAsync(EmailDTO dto);
        Task<bool> DeleteEmailAsync(int emailId);
        Task<IEnumerable<SubscriptionEmailDTO>> GetAllEmailsAsync();
        Task<bool> SendMassEmailAsync(string subject, string htmlMessage);
        Task<bool> AddEmailAsync(SubscriptionEmailDTO subscriptionEmailDto);
        Task<bool> UnsubscribeEmailAsync(string email);
        Task<bool> CreateHelpMessageAsync(EmailDTO dto);
    }
}
