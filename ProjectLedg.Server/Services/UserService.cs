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
using ProjectLedg.Server.Data.Models.DTOs.User;

namespace ProjectLedg.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthenticationService _authService;
        private readonly IEmailSender _emailSender;
        private readonly UserManager<User> _userManager;

        public UserService(IUserRepository userRepository, IEmailSender emailSender, AuthenticationService authService, UserManager<User> userManager)
        {
            _userRepository = userRepository;
            _emailSender = emailSender;
            _authService = authService;
            _userManager = userManager;
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();

            var userDTOs = new List<UserDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var filteredRoles = roles.Where(role => role == "User").ToList(); // Filter only "User" roles

                userDTOs.Add(new UserDTO
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed,
                    LastLoginDate = user.LastLoginDate,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    Roles = filteredRoles // Include filtered roles
                });
            }

            return userDTOs;
        }



        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                return LoginResult.Failed("Invalid email or password.");
            }

            if (!user.EmailConfirmed)
            {
                return LoginResult.Failed("The Email is not confirmed, please check your email for a confirmation link!");
            }

            var result = await _userRepository.LoginAsync(email, password);

            if (!result.Success && !result.Require2FA)
            {
                return LoginResult.Failed("Invalid email or password.");
            }
            else if (result.Require2FA)
            {
                var twoFactorToken = await _authService.GenerateToken(user);
                return LoginResult.Requires2FA(twoFactorToken);
            }

            // Generate JWT token
            var jwtToken = await _authService.GenerateToken(user);

            // Retrieve roles from the user
            var roles = await _userRepository.GetUserRolesAsync(user);

            // Update LastLoginDate on successful login
            user.LastLoginDate = DateTime.UtcNow;
            await _userRepository.UpdateUserAsync(user); // Make sure this method saves changes to the database

            return LoginResult.Successful(jwtToken, roles.ToList());
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
                UserName = request.Email, // Set email as the username
                                          // Set other properties as needed
            };

            // Save the new user to the database
            var result = await _userRepository.CreateUserAsync(user, request.Password);

            if (result.Succeeded)
            {
                // Assign "User" role to the newly created user
                var roleResult = await _userRepository.AddUserToRoleAsync(user, "User");
                if (!roleResult.Succeeded)
                {
                    return new AccountCreationResult
                    {
                        Success = false,
                        Errors = roleResult.Errors.Select(e => e.Description).ToList()
                    };
                }

                // Send confirmation email
                var emailResult = await _emailSender.SendEmailAsync(
                    request.Email,
                    "Account Created",
                    "<p>Your user account has been created successfully!</p>");

                // Generate JWT token
                var token = await _authService.GenerateToken(user);

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

        public async Task<int> GetTotalUsersAsync()
        {
            return await _userRepository.CountUsersAsync();
        }

        public async Task<int> GetLoginsTodayAsync()
        {
            return await _userRepository.CountLoginsSinceAsync(DateTime.UtcNow.Date);
        }

        public async Task<int> GetLoginsThisWeekAsync()
        {
            var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
            return await _userRepository.CountLoginsSinceAsync(startOfWeek);
        }

        public async Task<int> GetLoginsThisYearAsync()
        {
            var startOfYear = new DateTime(DateTime.UtcNow.Year, 1, 1);
            return await _userRepository.CountLoginsSinceAsync(startOfYear);
        }
    }
}
