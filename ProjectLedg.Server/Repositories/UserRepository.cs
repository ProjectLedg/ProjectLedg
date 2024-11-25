using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace ProjectLedg.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _baseUrl = "https://localhost:7294";
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly AuthenticationService _authService;
        private readonly IEmailSender _emailSender;
        private readonly ProjectLedgContext _context;

        public UserRepository(UserManager<User> userManager, SignInManager<User> signInManager, AuthenticationService authService, IEmailSender emailSender, ProjectLedgContext context, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
            _emailSender = emailSender;
            _context = context;
            _roleManager = roleManager;
        }

        // CreateUserAsync - updated to match IUserRepository
        public async Task<IdentityResult> CreateUserAsync(User user, string password)
        {
            if (string.IsNullOrEmpty(user.UserName))
            {
                user.UserName = user.Email;  //setting the Email as the Username
            }

            IdentityResult createUserResult = await _userManager.CreateAsync(user, password);

            if (!createUserResult.Succeeded)
                return IdentityResult.Failed(new IdentityError { Description = string.Join(", ", createUserResult.Errors.Select(e => e.Description)) });

            // Generate email confirmation token
            string emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            string callbackUrl = $"{_baseUrl}/confirm-email?userId={user.Id}&code={Uri.EscapeDataString(emailConfirmationToken)}";

            string emailSubject = "ProjectLedg - Bekräfta ditt konto!";
            string emailBody =
                $"<h2>Välkommen till ProjectLedg!</h2>" +
                $"<p>Tack för att du har valt att använda ProjectLedg. Nu är det bara ett sista steg kvar för att komma igång.<br>" +
                $"Klicka på länken nedan för att bekräfta din e-postadress:<br>" +
                $"<a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>Verifiera din e-postadress</a>.<br><br>" +
                $"Om länken inte fungerar, kopiera och klistra in följande URL i din webbläsare:<br>" +
                $"{callbackUrl}<br><br>" +
                $"Har du frågor eller funderingar? Du är alltid välkommen att svara på detta mejl.<br><br>" +
                $"Vänliga hälsningar,<br>" +
                $"Team ProjectLedg</p>";

            var sendEmailResult = await _emailSender.SendEmailAsync(user.Email, emailSubject, emailBody);
            if (!sendEmailResult.Success)
                return IdentityResult.Failed(new IdentityError { Description = "Failed to send email: " + string.Join(", ", sendEmailResult.ErrorMessage) });

            return IdentityResult.Success;
        }

        // Get a specific User by ID
        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        // Return all Users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        // Update an existing User
        public async Task<IdentityResult> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        // Delete an User
        public async Task<IdentityResult> DeleteUserAsync(string password, ClaimsPrincipal currentUser)
        {
            string? email = currentUser.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return IdentityResult.Failed(new IdentityError { Description = "No matching user found with the provided email." });

            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return IdentityResult.Failed(new IdentityError { Description = "No matching user found." });

            if (!await _userManager.CheckPasswordAsync(user, password))
                return IdentityResult.Failed(new IdentityError { Description = "Invalid login credentials." });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                IdentityResult deleteAccountResult = await _userManager.DeleteAsync(user);
                if (!deleteAccountResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return IdentityResult.Failed(new IdentityError { Description = "Something went wrong while attempting to delete the account." });
                }

                await transaction.CommitAsync();
                return IdentityResult.Success;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // User login logic
        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            User? user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return LoginResult.Failed("No User found.");

            var loginResult = await _signInManager.PasswordSignInAsync(email, password, isPersistent: false, lockoutOnFailure: true);

            if (loginResult.Succeeded)
            {
                string token = await _authService.GenerateToken(user);

                // Retrieve the user's roles
                var roles = await _userManager.GetRolesAsync(user);

                return LoginResult.Successful(token, roles.ToList()); // Pass roles to Successful result
            }
            else if (loginResult.RequiresTwoFactor)
            {
                string token = await _authService.GenerateToken(user);
                return LoginResult.Requires2FA(token);
            }

            if (loginResult.IsNotAllowed)
                return LoginResult.Failed("You must confirm your account to log in. Please check your email for a verification link.");

            if (loginResult.IsLockedOut)
                return LoginResult.Failed("The account is locked due to multiple failed attempts. Try again in a few minutes.");

            return LoginResult.Failed("Invalid login attempt.");
        }

        public async Task<List<string>> GetUserRolesAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task<IdentityResult> AddUserToRoleAsync(User user, string role)
        {
            // Ensure the role exists
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists)
            {
                throw new InvalidOperationException($"Role '{role}' does not exist.");
            }

            // Add the user to the role
            return await _userManager.AddToRoleAsync(user, role);
        }


        // Send email verification logic
        public async Task<IdentityResult> SendEmailVerificationAsync(string userId, string code)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code))
                return IdentityResult.Failed(new IdentityError { Description = "Invalid user ID or verification code." });

            User? user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return IdentityResult.Failed(new IdentityError { Description = "No user found." });

            IdentityResult result = await _userManager.ConfirmEmailAsync(user, Uri.UnescapeDataString(code));
            return result.Succeeded
                ? IdentityResult.Success
                : IdentityResult.Failed(new IdentityError { Description = "Failed to confirm email: " + string.Join(", ", result.Errors.Select(e => e.Description)) });
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<int> CountLoginsSinceAsync(DateTime startDate)
        {
            return await _context.Users
                .Where(user => user.LastLoginDate >= startDate)
                .CountAsync();
        }

        public async Task<int> CountUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<List<User>> GetUsersByIdsAsync(List<string> userIds)
        {
            return await _context.Users
                .Where(user => userIds.Contains(user.Id))
                .ToListAsync();
        }

        public async Task<User> GetUserAndCompaniesAsync(string userId)
        {
            return await _context.Users.Include(u => u.Companies).SingleOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User> GetUserAndInvoicesAsync(string userId)
        {
            return await _context.Users
                .Include(u => u.Companies)
                .ThenInclude(c => c.IngoingInvoices)
                .SingleOrDefaultAsync(u => u.Id == userId);
        }
    }
}
