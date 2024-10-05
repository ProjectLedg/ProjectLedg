using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Model.DTOs.User;

namespace ProjectLedg.Server.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserController(IUserService userService, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // GET: api/User/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users.Select(a => new { a.Id, a.Email }));
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/User/create
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
        [HttpPut("edit")]
        public async Task<IActionResult> EditUser([FromBody] User user)
        {
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
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromForm] string email, [FromForm] string password)
        {
            var result = await _userService.LoginAsync(email, password);
            if (result.Success)
            {
                // Create a cookie for the JWT token
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddHours(1)
                };
                Response.Cookies.Append("JWTToken", result.Token, cookieOptions);

                return Ok(new { Message = "Login successful", token = result.Token });
            }
            else if (result.Require2FA)
            {
                // Create a cookie for the JWT token
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddHours(1)
                };
                Response.Cookies.Append("JWTToken", result.Token, cookieOptions);
                return Unauthorized(new { Message = "Requires Two Factor Authentication", token = result.Token });
            }
            else
            {
                return Unauthorized(new { message = result.ErrorMessage });
            }
        }

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
    }
}
