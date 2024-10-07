using ProjectLedg.Server.Options.Email;

namespace ProjectLedg.Options.Email.IEmail
{
    public interface IEmailSender
    {
        public Task<EmailResult> SendEmailAsync(string email, string subject, string body);
    }
}
