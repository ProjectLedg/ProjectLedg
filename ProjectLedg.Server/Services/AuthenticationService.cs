using Microsoft.AspNetCore.Identity;
using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories;

namespace ProjectLedg.Server.Services
{
    public class AuthenticationService
    {
        private readonly JwtRepository _jwtRepository;
        private readonly UserManager<User> _userManager;

        public AuthenticationService(JwtRepository jwtRepository, UserManager<User> userManager)
        {
            _jwtRepository = jwtRepository;
            _userManager = userManager;
        }

        public async Task<string> GenerateToken(User user)
        {
            try
            {
                //Fetch roles for the user
                var roles = await _userManager.GetRolesAsync(user);

                //Pass user and roles to GenerateJwt
                return _jwtRepository.GenerateJwt(user, roles.ToList());
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while generating the JWT.", ex);
            }
        }
    }
}