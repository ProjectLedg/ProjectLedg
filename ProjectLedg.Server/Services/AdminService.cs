using Microsoft.AspNetCore.Identity;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Options.Email;
using ProjectLedg.Server.Repositories;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<User> _userManager;
        private readonly AuthenticationService _authenticationService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailSender _emailSender;

        public AdminService(IAdminRepository adminRepository, UserManager<User> userManager, AuthenticationService authenticationService, IUserRepository userRepository, IEmailSender emailSender)
        {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _authenticationService = authenticationService;
            _userRepository = userRepository;
            _emailSender = emailSender;
        }

        public async Task<LoginResult> AdminLoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return LoginResult.Failed("Invalid email or password.");
            }

            var loginResult = await _userManager.CheckPasswordAsync(user, password);
            if (!loginResult)
            {
                return LoginResult.Failed("Invalid email or password.");
            }

            // Ensure user has either "Admin" or "Manager" role
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Any(r => r == "Admin" || r == "Manager"))
            {
                return LoginResult.Failed("Access denied. Only Admins and Managers can log in.");
            }

            // Generate JWT token for the admin user
            var token = await _authenticationService.GenerateToken(user);
            return LoginResult.Successful(token, roles.ToList());
        }


        public async Task<AccountCreationResult> CreateAdminsAsync(CreateAccountRequestDTO request, ClaimsPrincipal currentUser)
        {
            if (!currentUser.IsInRole("Manager"))
                return new AccountCreationResult { Success = false, Errors = new[] { "Access denied." } };

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };
            var result = await _adminRepository.CreateAdminAsync(user, request.Password);

            return new AccountCreationResult
            {
                Success = result.Succeeded,
                Errors = result.Succeeded ? null : result.Errors.Select(e => e.Description)
            };
        }

        public async Task<IdentityResult> UpdateAdminsAsync(User user)
        {
            return await _adminRepository.UpdateAdminAsync(user);
        }

        public async Task<IdentityResult> DeleteAdminsAsync(string id, ClaimsPrincipal currentUser)
        {
            if (!currentUser.IsInRole("Manager") && !currentUser.IsInRole("Admin"))
                return IdentityResult.Failed(new IdentityError { Description = "Access denied." });

            var user = await _adminRepository.GetAdminByIdAsync(id);
            return user == null ? IdentityResult.Failed(new IdentityError { Description = "User not found." }) : await _adminRepository.DeleteAdminAsync(user);
        }

        public async Task<IEnumerable<User>> GetAllAdminsAsync()
        {
            return await _adminRepository.GetAllAdminsAsync();
        }

        public async Task<User> GetUserById(string id)
        {
            return await _adminRepository.GetAdminByIdAsync(id);
        }

        public async Task<EmailResult> SendNewsletterToAllUsersAsync(string subject, string content)
        {
            var allUsers = await _userRepository.GetAllUsersAsync();
            var failedEmails = new List<string>();

            foreach (var user in allUsers)
            {
                var result = await _emailSender.SendEmailAsync(user.Email, subject, content);
                if (!result.Success)
                {
                    failedEmails.Add(user.Email);
                }
            }

            return failedEmails.Any()
                ? new EmailResult { Success = false, ErrorMessage = "Failed to send emails to some users." }
                : new EmailResult { Success = true };
        }

        public async Task<EmailResult> SendTargetedEmailAsync(List<string> userIds, string subject, string content)
        {
            var users = await _userRepository.GetUsersByIdsAsync(userIds);
            var failedEmails = new List<string>();

            foreach (var user in users)
            {
                var result = await _emailSender.SendEmailAsync(user.Email, subject, content);
                if (!result.Success)
                {
                    failedEmails.Add(user.Email);
                }
            }

            return failedEmails.Any()
                ? new EmailResult { Success = false, ErrorMessage = "Failed to send emails to some users." }
                : new EmailResult { Success = true };
        }
    }
}
