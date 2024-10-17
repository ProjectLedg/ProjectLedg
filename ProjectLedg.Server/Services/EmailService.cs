using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data.Models.DTOs.Email;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;

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
                await _emailSender.SendEmailAsync(dto.Email,"Tack för att du hör av dig!",
                     $"<h2>Tack för att du hört av dig!</h2>" +
                    $"<p>Hej {dto.Name}<br> Vi uppskattar att du kontaktat oss. Vi kommer att återkomma till dig så snart som möjligt.<br>" +
                    $"Vänliga hälsningar,<br>" +
                    $"Team ProjectLedg</p>"
                    );
                return true;
            }
            else
            {
                return false;
            }

        }

        public async Task<bool> DeleteEmailAsync(int emailId)
        {
            var response = await _emailRepository.DeleteEmailListAsync(emailId);
            return response;
        }

        public async Task<IEnumerable<EmailDTO>> GetAllEmailsAsync()
        {
            var emails = await _emailRepository.GetAllEmailListAsync();
            return emails.Select(a => new EmailDTO
            {
                Email = a.Email,
                Name = a.Name,
                Message = a.Message
            }).ToList();
        }
    }
}
