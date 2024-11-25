using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectLedg.Server.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<GoogleController> _logger;

        public GoogleController(IConfiguration configuration, UserManager<User> userManager, ILogger<GoogleController> logger)
        {
            _configuration = configuration;
            _userManager = userManager;
            _logger = logger;
        }

        [AllowAnonymous] // NOT AUTHORIZED - need to be unlocked to be able to login
        [HttpGet("/login-google")]
        public IActionResult GoogleLogin()
        {
            var redirectUri = Url.Action("googleresponse");
            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [AllowAnonymous] // NOT AUTHORIZED - need to be unlocked to be able to login
        [HttpGet("/googleresponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            var claimsPrincipal = result.Principal;

            if (claimsPrincipal == null)
            {
                return BadRequest("Google authentication failed");
            }

            var claims = claimsPrincipal.Claims;
            var token = GenerateJwtToken(claims);
            string email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);

            _logger.LogInformation("User claims:");
            foreach (var claim in claims)
            {
                _logger.LogInformation($"{claim.Type}: {claim.Value}");
            }
            _logger.LogInformation($"Email: {email}");

            if (string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Google authentication failed: email not found");
                return BadRequest("Google authentication failed: email not found");
            }

            var user = await _userManager.FindByEmailAsync(email);

            //if the user doesnt exist we create a new one.
            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                var createResult = await _userManager.CreateAsync(user);

                if (!createResult.Succeeded)
                {
                    return BadRequest("Failed to create user");
                }
            }

            //Associate the google login with the user
            var loginInfo = new UserLoginInfo(GoogleDefaults.AuthenticationScheme, 
                result.Principal.FindFirstValue(ClaimTypes.NameIdentifier), 
                GoogleDefaults.AuthenticationScheme);

            var userLogins = await _userManager.GetLoginsAsync(user);
            if (!userLogins.Any(l => l.LoginProvider == loginInfo.LoginProvider && l.ProviderKey == loginInfo.ProviderKey))
            {
                var addLoginResult = await _userManager.AddLoginAsync(user, loginInfo);

                if (!addLoginResult.Succeeded)
                {
                    return BadRequest("Failed to add login to user");
                }
            }

            // Set the JWT token as an HTTP-only cookie
            Response.Cookies.Append("JWTToken", token, new CookieOptions
            {
                HttpOnly = true, // This ensures the cookie is not accessible via JavaScript
                Secure = true, // Set to true if using HTTPS
                SameSite = SameSiteMode.Strict, // Adjust based on your security needs (Strict or Lax)
                Expires = DateTime.UtcNow.AddHours(1) // Token expiry matches cookie expiry
            });
            //return Ok(new { token }); 
            return Redirect("https://localhost:5173/company-select");
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims)
        {
            //var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                Environment.GetEnvironmentVariable("JWT_SECRET"))); //Remember to use correct JWT name here 
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                //issuer: _configuration["Jwt:Issuer"],
                //audience: _configuration["Jwt:Audience"],
                issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
                audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
