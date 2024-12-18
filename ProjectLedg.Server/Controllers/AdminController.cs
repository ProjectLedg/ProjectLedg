using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options.Email.IEmail;
using ProjectLedg.Server.Options.Newsletter;
using ProjectLedg.Server.Options.Notice;
using ProjectLedg.Server.Services;
using ProjectLedg.Server.Services.IServices;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin, Manager")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService, INoticeService noticeService)
        {
            _adminService = adminService;
        }

        // Only managers can create admins
        [HttpPost("createAdmin")]
        public async Task<IActionResult> CreateAdmin(CreateAccountRequestDTO request)
        {
            var result = await _adminService.CreateAdminsAsync(request, User);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }

        // Accessible by Admins and Managers
        [HttpGet("getAllAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _adminService.GetAllAdminsAsync();
            return Ok(admins);
        }

        [HttpGet("getAdminById/{id}")]
        public async Task<IActionResult> GetAdminById(string id)
        {
            var admin = await _adminService.GetUserById(id);
            return admin != null ? Ok(admin) : NotFound();
        }

        [HttpPut("updateAdmin")]
        public async Task<IActionResult> UpdateAdmin(User admin)
        {
            // Add logic to verify JWT is the user we're trying to access (use claims)
            var result = await _adminService.UpdateAdminsAsync(admin);
            return result.Succeeded ? Ok() : BadRequest();
        }

        [HttpDelete("deleteAdmin/{id}")]
        public async Task<IActionResult> DeleteAdmin(string id)
        {
            // Add logic to verify JWT is the user we're trying to access (use claims)

            var result = await _adminService.DeleteAdminsAsync(id, User);
            return result.Succeeded ? Ok() : BadRequest();
        }

        [AllowAnonymous]
        [HttpPost("admin-login")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginRequestDTO request)
        {
            var result = await _adminService.AdminLoginAsync(request.Email, request.Password);
            var roles = result.Roles;
            if (result.Success)
            {
                // Set secure, HTTP-only cookie for the JWT token
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(1) // Set expiry as needed
                };
                Response.Cookies.Append("JWTToken", result.Token, cookieOptions);

                return Ok(new { Message = "Login successful", Token = result.Token, Roles = roles });
            }
            return Unauthorized(result.ErrorMessage);
        }

        [HttpPost("newsletter")]
        public async Task<IActionResult> SendNewsletter([FromBody] NewsletterRequest request)
        {
            var result = await _adminService.SendNewsletterToAllUsersAsync(request.Subject, request.Content);

            if (result.Success)
            {
                return Ok(new { Message = "Newsletter sent successfully" });
            }

            return BadRequest(new { Message = result.ErrorMessage });
        }

        // POST: api/admin/targeted-email
        [HttpPost("targeted-email")]
        public async Task<IActionResult> SendTargetedEmail([FromBody] TargetedEmailRequest request)
        {
            var result = await _adminService.SendTargetedEmailAsync(request.UserIds, request.Subject, request.Content);

            if (result.Success)
            {
                return Ok(new { Message = "Targeted email sent successfully" });
            }

            return BadRequest(new { Message = result.ErrorMessage });
        }

        [HttpPost("email-notification")]
        public async Task<IActionResult> SendEmailNotification([FromBody] EmailNotificationRequest request)
        {
            var result = await _adminService.SendEmailNotificationAsync(request.Subject, request.Content);

            if (result.Success)
            {
                return Ok(new { Message = "Email notification sent successfully" });
            }

            return BadRequest(new { Message = result.ErrorMessage });
        }
    }
}