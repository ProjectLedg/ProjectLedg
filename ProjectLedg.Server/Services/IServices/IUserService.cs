using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Model.DTOs.User;
using System.Security.Claims;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task<AccountCreationResult> CreateUserAsync(CreateAccountRequestDTO request);
        Task<IdentityResult> UpdateUserAsync(User user);
        Task<IdentityResult> DeleteUserAsync(string password, ClaimsPrincipal currentUser);
        Task<LoginResult> LoginAsync(string email, string password);
        Task<IdentityResult> SendEmailVerificationAsync(string userId, string code);


        //statistics

        Task<int> GetTotalUsersAsync();
        Task<int> GetLoginsTodayAsync();
        Task<int> GetLoginsThisWeekAsync();
        Task<int> GetLoginsThisYearAsync();
    }
}
