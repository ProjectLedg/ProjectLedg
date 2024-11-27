using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.IdentityModel.Tokens;
using ProjectLedg.Server.Data.Models.DTOs.Email;
using ProjectLedg.Server.Services.IServices;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;

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

        [AllowAnonymous]
        [HttpPost("create-help-message")]
        public async Task<IActionResult> CreateHelpMessage([FromBody] EmailDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _emailService.CreateHelpMessageAsync(dto);

            if (response)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500, "An error occurred while sending the help message");
            }
        }

        // AUTH ???
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

        [Authorize(Roles = "Admin")] // ???
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

        //[Authorize(Roles = "Admin")] // ???
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllEmails()
        {
            var emails = await _emailService.GetAllEmailsAsync();
            return Ok(emails);
        }

        [Authorize(Roles = "Admin")] // ???
        [HttpPost("SendMassEmail")]
        public async Task<IActionResult> SendMassEmail([FromBody] MassEmailDTO massEmailDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _emailService.SendMassEmailAsync(massEmailDto.Subject, massEmailDto.Message);

            if (response)
            {
                return Ok("E-mailmessages sent to the whole list");
            }
            else
            {
                return StatusCode(500, "Error occured while sending e-mailmessages");
            }
        }

        [AllowAnonymous] //NOT AUTHORIZED - open for all to sign up to email list
        [HttpPost("AddEmail")]
        public async Task<IActionResult> AddEmail([FromBody] SubscriptionEmailDTO subscriptionEmailDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _emailService.AddEmailAsync(subscriptionEmailDto);

            if (response)
            {
                return Ok("E-mail added to list!");
            }
            else
            {
                return StatusCode(500, "An Error occured while trying to add email to list");
            }
        }

        [AllowAnonymous]// NOT AUTHORIZED - open for all to unsubscribe from link sent in email
        [HttpGet("Unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return Content("Token is missing");
            }

            var cleanToken = token.Split('&')[0];

            // Decode the token (this helps in case URL encoding happens)
            var decodedToken = Uri.UnescapeDataString(token);
         
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"));

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.FromDays(5),
                }, out SecurityToken validatedToken);

                //Extract the email from the token claims
                var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                if (email == null)
                {
                    return BadRequest("Invalid token.");
                }

                //Proceed with email removal
                var response = await _emailService.UnsubscribeEmailAsync(email);
                if (response)
                {
                    return Ok("Successfully unsubscribed from the newsletter.");
                }
                else
                {
                    return NotFound("E-mail adress not found.");
                }
            }
            catch (SecurityTokenExpiredException ex)
            {
                Console.WriteLine($"Token expired: {ex.Message}");
                return BadRequest("Token has expired.");
            }
            catch (SecurityTokenSignatureKeyNotFoundException ex)
            {
                Console.WriteLine($"Signing key not found: {ex.Message}");
                return BadRequest("Invalid signing key.");
            }
            catch (SecurityTokenInvalidSignatureException ex)
            {
                Console.WriteLine($"Invalid token signature: {ex.Message}");
                return BadRequest("Invalid token signature.");
            }
            catch (SecurityTokenValidationException ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return BadRequest($"Token validation failed: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return BadRequest("Invalid token.");
            }
        }
    }
}
