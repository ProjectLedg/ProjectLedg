using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using System.Security.Claims;

namespace ProjectLedg.Server.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        public Task<IdentityResult> CreateAdminAsync(User user, string password)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> DeleteAdminAsync(string password, ClaimsPrincipal currentUser)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetAdminByEmailAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetAdminsById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<User>> GetAllAdminsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<LoginResult> LoginAsync(string email, string password)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> SendEmailVerificationAsync(string userId, string code)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> UpdateAdminAsync(User user)
        {
            throw new NotImplementedException();
        }
    }
}
