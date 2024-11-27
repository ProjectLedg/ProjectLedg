using Microsoft.IdentityModel.Tokens;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Data.Models.DTOs.Email;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectLedg.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly IEmailSender _emailSender;
        private readonly IEmailRepository _emailRepository;

        public EmailService(IEmailSender emailSender, IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
            _emailSender = emailSender;
        }

        public async Task<bool> AddEmailAsync(SubscriptionEmailDTO subscriptionEmailDto)
        {
            var emailEntity = new EmailList
            {
                Email = subscriptionEmailDto.Email
            };

            await _emailRepository.AddEmailAsync(emailEntity);

            //Generate JWT token for the unsubscribe link 
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Email, subscriptionEmailDto.Email) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            

            // Built unsubscribe-link 
            string unsubscribeLink = "https://localhost:7223/api/email/unsubscribe?token=" + tokenString;

            // Built email message with HTML tags 
            string emailBody = "<h2>Tack för att du prenumererar!</h2>" +
                      "<p>Vi uppskattar att du har registrerat dig för att få de senaste nyheterna och uppdateringarna från oss.</p>" +
                      "<p>Håll utkik i din inkorg för framtida meddelanden!</p>" +
                      "<p>Med vänliga hälsningar,<br>Team Ledge</p>" +
                      "<br><br><br>" +
                      "<p style='font-size: 12px;'>Om du vill avregistrera dig, <a href='" + unsubscribeLink + "'>klicka här</a>.</p>";

            await _emailSender.SendEmailAsync(subscriptionEmailDto.Email, "Tack för din prenumeration!", emailBody);
            return true;
        }

        public async Task<bool> CreateEmailAsync(EmailDTO dto)
        {
            var response = await _emailRepository.CreateEmailAsync(new Data.Models.EmailList
            {
                Email = dto.Email,
                Name = dto.Name,
                Message = dto.Message
            });

            if (response)
            {
                await _emailSender.SendEmailAsync(dto.Email, "Tack för att du hör av dig!",
                     $"<h2>Tack för att du hört av dig!</h2>" +
                    $"<p>Hej {dto.Name}<br> Vi uppskattar att du kontaktat oss. Vi kommer att återkomma till dig så snart som möjligt.<br>" +
                    $"Vänliga hälsningar,<br>" +
                    $"Team Ledge</p>"
                    );
                return true;
            }
            else
            {
                return false;
            }

        }

        public Task<bool> CreateHelpMessageAsync(EmailDTO dto)
        {
            var emailToSave = new EmailList
            {
                Email = dto.Email,
                Name = dto.Name,
                Message = dto.Message
            };
            return _emailRepository.CreateEmailAsync(emailToSave);
        }

        public async Task<bool> DeleteEmailAsync(int emailId)
        {
            var response = await _emailRepository.DeleteEmailListAsync(emailId);
            return response;
        }

        public async Task<IEnumerable<SubscriptionEmailDTO>> GetAllEmailsAsync()
        {
            var emails = await _emailRepository.GetAllEmailListAsync();
            return emails.Select(a => new SubscriptionEmailDTO
            {
                Email = a.Email
            }).ToList();
        }

        public async Task<bool> SendMassEmailAsync(string subject, string htmlMessage)
        {
            var allEmails = await _emailRepository.GetAllEmailListAsync();

            foreach (var email in allEmails)
            {
                var result = await _emailSender.SendEmailAsync(email.Email, subject, htmlMessage);

                if (!result.Success)
                {
                    //handle errors
                    Console.WriteLine($"Failed to send email to: {email.Email}, Error: {result.ErrorMessage}");
                }
            }

            return true;
        }

        public async Task<bool> UnsubscribeEmailAsync(string email)
        {
            var response = await _emailRepository.DeleteEmailByEmailAsync(email);
            return response;
        }
    }
}
