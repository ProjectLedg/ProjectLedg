using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using System.Security.Claims;

namespace ProjectLedg.Server.Repositories.IRepositories
{
    public interface IAdminRepository
    {
        Task<IdentityResult> CreateAdminAsync(User user, string password);
        Task<IdentityResult> UpdateAdminAsync(User user);
        Task<IdentityResult> DeleteAdminAsync(User user);
        Task<User> GetAdminByIdAsync(string id);
        Task<IEnumerable<User>> GetAllAdminsAsync();
    }
}
