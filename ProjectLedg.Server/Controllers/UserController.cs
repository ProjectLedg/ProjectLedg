using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options.Notice;
using ProjectLedg.Server.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly INoticeService _noticeService;

        public UserController(IUserService userService, UserManager<User> userManager, SignInManager<User> signInManager, INoticeService noticeService)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _noticeService = noticeService;
        }

        // GET: api/User/all
        [Authorize(Roles = "Manager, Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users.Select(a => new { a.Id, a.Email, a.EmailConfirmed, a.LastLoginDate, a.FirstName, a.LastName, a.TwoFactorEnabled, a.Roles }));
        }

        // GET: api/User/{id}
        [Authorize]
        [HttpGet("getUser")]
        public async Task<IActionResult> GetUserByIdAsync()
        {
            ClaimsPrincipal claimsUser = User;
            if (claimsUser == null)
            {
                return NotFound();
            }
            string userId = claimsUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(); // User ID not found in claims
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/User/create
        [AllowAnonymous] // NOT AUTHORIZED - Users need to be able to crate account
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateAccountRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.CreateUserAsync(request);

            if (result.Success)
            {
                // Return the JWT token with the success message
                return Ok(new { Message = "User created successfully", Token = result.Token });
            }

            return BadRequest(new { Message = result.Errors });
        }

        // PUT: api/User/edit
        [Authorize]
        [HttpPut("edit")]
        public async Task<IActionResult> EditUser([FromBody] User user)
        {
            // Verify that the user we're trying to edit is the one logged in with JWT (use claims)

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.UpdateUserAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { Message = "User updated successfully" });
            }

            return BadRequest(result.Errors);
        }

        // DELETE: api/User/delete/{id}
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id, [FromBody] DeleteUserRequestModel model)
        {
            var result = await _userService.DeleteUserAsync(model.Password, User);
            if (result.Succeeded)
            {
                return Ok(new { Message = "User deleted successfully" });
            }

            return BadRequest(result.Errors);
        }

        // POST: api/User/login
        [AllowAnonymous]// NOT AUTHORIZED - user need to be able to login
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromForm] string email, [FromForm] string password)
        {
            var result = await _userService.LoginAsync(email, password);
            if (result.Success)
            {
                var roles = result.Roles;
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.Now.AddHours(1)
                };
                //Response.Cookies.Append("JWTToken", result.Token, cookieOptions);

                return Ok(new { Message = "Login successful", Token = result.Token, Roles = roles });
            }
            else if (result.Require2FA)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddHours(1)
                };
                Response.Cookies.Append("JWTToken", result.Token, cookieOptions);
                return Unauthorized(new { Message = "Requires Two Factor Authentication", Token = result.Token });
            }
            else
            {
                return Unauthorized(new { Message = result.ErrorMessage });
            }
        }

        [AllowAnonymous]// NOT AUTHORIZED - user need to confirm email
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequestDTO model)
        {
            var result = await _userService.SendEmailVerificationAsync(model.Id, model.Code);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Email confirmed successfully" });
            }

            return BadRequest(new { Message = "Email verification failed" });
        }

        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok("Password changed successfully.");
            }

            return BadRequest("Password change failed.");
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpPost("send-notice")]
        public async Task<IActionResult> SendNotice([FromBody] NoticeRequest request)
        {
            await _noticeService.SendNoticeToUserAsync(request.UserId, request.Title, request.Content);
            return Ok(new { Message = "Notice sent successfully" });
        }

        [Authorize]
        [HttpGet("notices")]
        public async Task<IActionResult> GetUserNotices()
        {
            ClaimsPrincipal claimsUser = User;
            if (claimsUser == null)
            {
                return NotFound();
            }
            string userId = claimsUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(); // User ID not found in claims
            }

            var notices = await _noticeService.GetUserNoticesAsync(userId);
            return Ok(notices);
        }
    }
}
