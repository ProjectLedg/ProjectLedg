using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IAdminRepository
    {
        Task<IEnumerable<User>> GetAllAdminsAsync();
        Task<User> GetAdminsById(string id);
        Task<IdentityResult> CreateAdminAsync(User user, string password);
        Task<IdentityResult> UpdateAdminAsync(User user);
        Task<IdentityResult> DeleteAdminAsync(string password, ClaimsPrincipal currentUser);
        Task<LoginResult> LoginAsync(string email, string password);
        Task<IdentityResult> SendEmailVerificationAsync(string userId, string code);
        Task<User> GetAdminByEmailAsync(string email);
    }
}
