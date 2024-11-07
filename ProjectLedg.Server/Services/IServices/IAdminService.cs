using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Services.IServices
{
    public interface IAdminService
    {
        Task<LoginResult> AdminLoginAsync(string email, string password);
        Task<AccountCreationResult> CreateAdminsAsync(CreateAccountRequestDTO request, ClaimsPrincipal currentUser);
        Task<IdentityResult> UpdateAdminsAsync(User user);
        Task<IdentityResult> DeleteAdminsAsync(string id, ClaimsPrincipal currentUser);
        Task<IEnumerable<User>> GetAllAdminsAsync();
        Task<User> GetUserById(string id);
    }
}
