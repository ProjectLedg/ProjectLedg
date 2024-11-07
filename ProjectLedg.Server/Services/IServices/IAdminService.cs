using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IAdminService
    {
        Task<IEnumerable<User>> GetAllAdminsAsync();
        Task<User> GetUserById(string id);
        Task<AccountCreationResult> CreateAdminsAsync(CreateAccountRequestDTO request);
        Task<IdentityResult> UpdateAdminsAsync(User user);
        Task<IdentityResult> DeleteAdminsAsync(string password, ClaimsPrincipal currentUser);
        Task<LoginResult> AdminLoginAsync(string email, string password);
        Task<IdentityResult> SendEmailVerificationAsync(string userId, string code);
    }
}
