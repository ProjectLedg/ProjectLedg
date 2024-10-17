using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using ProjectLedg.Server.Data.Models.DTOs.Email;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] EmailDTO emailDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _emailService.CreateEmailAsync(emailDto);

            if (response)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500, "An error occurred while sending the email");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteEmail(int id)
        {
            var response = await _emailService.DeleteEmailAsync(id);
            if (response)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500, "An error occurred while deleting the email");
            }
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllEmails()
        {
            var emails = await _emailService.GetAllEmailsAsync();
            return Ok(emails);
        }
    }
}
