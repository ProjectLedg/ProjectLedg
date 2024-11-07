using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Model.DTOs.User;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Services.IServices;
using System.Security.Claims;

namespace ProjectLedg.Server.Services
{
    public class AdminService : IAdminService
    {
        public Task<LoginResult> AdminLoginAsync(string email, string password)
        {
            throw new NotImplementedException();
        }

        public Task<AccountCreationResult> CreateAdminsAsync(CreateAccountRequestDTO request)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> DeleteAdminsAsync(string password, ClaimsPrincipal currentUser)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<User>> GetAllAdminsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> SendEmailVerificationAsync(string userId, string code)
        {
            throw new NotImplementedException();
        }

        public Task<IdentityResult> UpdateAdminsAsync(User user)
        {
            throw new NotImplementedException();
        }
    }
}
