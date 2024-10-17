using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Services.IServices;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using ProjectLedg.Options.Email.IEmail;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Services;

namespace ProjectLedg.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthenticationService _authService;
        private readonly IEmailSender _emailSender;

        public UserService(IUserRepository userRepository, IEmailSender emailSender, AuthenticationService authService)
        {
            _userRepository = userRepository;
            _emailSender = emailSender;
            _authService = authService;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            try
            {
                var listOfUsers = await _userRepository.GetAllUsersAsync();

                return listOfUsers.Select(a => new User
                {
                    Id = a.Id,
                    Email = a.Email,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        public async Task<User> GetUserById(string id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                return new LoginResult { Success = false, ErrorMessage = "Invalid email or password." };
            }

            if (!user.EmailConfirmed)
            {
                return new LoginResult { Success = false, ErrorMessage = "The Email is not confirmed, please check your email for a confirmation link!" };
            }

            
            var result = await _userRepository.LoginAsync(email, password);

            if (!result.Success && !result.Require2FA)
            {
                return new LoginResult { Success = false, ErrorMessage = "Invalid email or password." };
            }
            else if (result.Require2FA)
            {
                return new LoginResult { Require2FA = true, Token = _authService.GenerateToken(user) };
            }
            // Generate JWT token
            var token = _authService.GenerateToken(user);

            return new LoginResult { Success = true, Token = token };
        }


        public async Task<AccountCreationResult> CreateUserAsync(CreateAccountRequestDTO request)
        {
            // Validate inputs
            if (string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.EmailConfirmed) ||
                string.IsNullOrEmpty(request.Password) ||
                string.IsNullOrEmpty(request.PasswordConfirmed))
            {
                return new AccountCreationResult
                {
                    Success = false,
                    Errors = new List<string> { "All fields are required." }
                };
            }

            // Ensure Email and EmailConfirmed match
            if (request.Email != request.EmailConfirmed)
            {
                return new AccountCreationResult
                {
                    Success = false,
                    Errors = new List<string> { "Emails do not match." }
                };
            }

            // Ensure Password and PasswordConfirmed match
            if (request.Password != request.PasswordConfirmed)
            {
                return new AccountCreationResult
                {
                    Success = false,
                    Errors = new List<string> { "Passwords do not match." }
                };
            }

            // Check if email already exists
            var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return new AccountCreationResult
                {
                    Success = false,
                    Errors = new List<string> { "Email is already taken." }
                };
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                // Set other properties as needed
            };

            // Save the new user to the database
            var result = await _userRepository.CreateUserAsync(user, request.Password);

            if (result.Succeeded)
            {
                // Send confirmation email
                var emailResult = await _emailSender.SendEmailAsync(
                    request.Email,
                    "Account Created",
                    "<p>Your user account has been created successfully!</p>");

                // Generate JWT token
                var token = _authService.GenerateToken(user);

                return new AccountCreationResult
                {
                    Success = true,
                    Token = token
                };
            }

            // If the IdentityResult fails, return error messages
            return new AccountCreationResult
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description)
            };
        }



        public async Task<IdentityResult> UpdateUserAsync(User user)
        {
            return await _userRepository.UpdateUserAsync(user);
        }

        public async Task<IdentityResult> DeleteUserAsync(string password, ClaimsPrincipal currentUser)
        {
            return await _userRepository.DeleteUserAsync(password, currentUser);
        }


        public async Task<IdentityResult> SendEmailVerificationAsync(string userId, string code)
        {
            return await _userRepository.SendEmailVerificationAsync(userId, code);
        }
    }
}
