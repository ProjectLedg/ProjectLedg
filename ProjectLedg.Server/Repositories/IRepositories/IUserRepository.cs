using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserById(string id);
        Task<IdentityResult> CreateUserAsync(User user, string password);
        Task<IdentityResult> UpdateUserAsync(User user);
        Task<IdentityResult> DeleteUserAsync(string password, ClaimsPrincipal currentUser);
        Task<LoginResult> LoginAsync(string email, string password);
        Task<IdentityResult> SendEmailVerificationAsync(string userId, string code);
        Task<User> GetUserByEmailAsync(string email);
        Task<List<string>> GetUserRolesAsync(User user);
        Task<IdentityResult> AddUserToRoleAsync(User user, string role);
        Task<int> CountUsersAsync();

        Task<int> CountLoginsSinceAsync(DateTime startDate);
    }
}
