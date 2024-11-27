using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectLedg.Server.Data.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace ProjectLedg.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MicrosoftController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<MicrosoftController> _logger;

        public MicrosoftController(IConfiguration configuration, UserManager<User> userManager, ILogger<MicrosoftController> logger)
        {
            _configuration = configuration;
            _userManager = userManager;
            _logger = logger;
        }

        [AllowAnonymous] // NOT AUTHORIZED - need to be unlocked to be able to login
        [HttpGet("/login-microsoft")]
        public IActionResult MicrosoftLogin()
        {
            var redirectUri = Url.Action("signinoicd", null, null, Request.Scheme);

            _logger.LogInformation("Redirect URI: {RedirectUri}", redirectUri);

            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };

            return Challenge(properties, MicrosoftAccountDefaults.AuthenticationScheme);
        }

        [AllowAnonymous] // NOT AUTHORIZED - need to be unlocked to be able to login
        [HttpGet("/signinoicd")]
        public async Task<IActionResult> Signinoidc()
        {
            var result = await HttpContext.AuthenticateAsync(MicrosoftAccountDefaults.AuthenticationScheme);

            if (!result.Succeeded)
            {
                _logger.LogError("Authentication failed");
                return BadRequest("Authentication failed");
            }

            var claimsPrincipal = result.Principal;

            if (claimsPrincipal == null)
            {
                return BadRequest("Microsoft authentication failed");
            }

            var claims = claimsPrincipal.Claims;
            var token = GenerateJwtToken(claims);
            string email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);

            _logger.LogInformation("User claims");
            foreach (var claim in claims)
            {
                _logger.LogInformation($"{claim.Type}: {claim.Value}");
            }
            _logger.LogInformation($"Email: {email}");

            if (string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Microsoft authentication failed: email not found");
                return BadRequest("Microsoft authentication failed: email not found");
            }

            var user = await _userManager.FindByEmailAsync(email);

            //If user doesnt exist, we create a new one.
            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                };

                var createResult = await _userManager.CreateAsync(user);

                if (!createResult.Succeeded)
                {
                    return BadRequest("Failed to create user");
                }
            }

            //Associate the Microsoft login with the user 
            var loginInfo = new UserLoginInfo(MicrosoftAccountDefaults.AuthenticationScheme,
                result.Principal.FindFirstValue(ClaimTypes.NameIdentifier),
                MicrosoftAccountDefaults.AuthenticationScheme);

            var userLogins = await _userManager.GetLoginsAsync(user);
            if (!userLogins.Any(l => l.LoginProvider == loginInfo.LoginProvider && l.ProviderKey == loginInfo.ProviderKey))
            {
                var addLoginResult = await _userManager.AddLoginAsync(user, loginInfo);

                if (!addLoginResult.Succeeded)
                {
                    return BadRequest("Failed to add login to user");
                }
            }

            //Set the JWT token as an HTTP-only cookie
            Response.Cookies.Append("JWTToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(3)
            });

            return Redirect("https://ledg.se/company-select");
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                Environment.GetEnvironmentVariable("JWT_SECRET")));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
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

