using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Options;
using ProjectLedg.Server.Repositories.IRepositories;
using System.Security.Claims;

namespace ProjectLedg.Server.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly UserManager<User> _userManager;

        public AdminRepository(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IdentityResult> CreateAdminAsync(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            }
            return result;
        }

        public async Task<IdentityResult> UpdateAdminAsync(User user)
        {
            return await _userManager.UpdateAsync(user);
        }

        public async Task<IdentityResult> DeleteAdminAsync(User user)
        {
            return await _userManager.DeleteAsync(user);
        }

        public async Task<User> GetAdminByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllAdminsAsync()
        {
            return await _userManager.GetUsersInRoleAsync("Admin");
        }
    }
}
