using Microsoft.Extensions.Options;
using MimeKit;
using ProjectLedg.Options.Email.IEmail;
using MailKit.Net.Smtp;

namespace ProjectLedg.Server.Options.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly MailKitSettings _emailSettings;

        public EmailSender(IOptions<MailKitSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }
        public async Task<EmailResult> SendEmailAsync(string email, string subject, string htmlMessage)
        {
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.Sender));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = htmlMessage
            };

            using (SmtpClient client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailSettings.MailServer, _emailSettings.MailPort, useSsl: false);
                    await client.AuthenticateAsync(_emailSettings.Sender, _emailSettings.Password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    return new EmailResult { Success = true };
                }
                catch (Exception ex)
                {
                    return new EmailResult { Success = false, ErrorMessage = ex.Message };
                }
            }
        }
    }
}
