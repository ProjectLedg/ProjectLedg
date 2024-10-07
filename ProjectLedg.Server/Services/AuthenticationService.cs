using ProjectLedg.Server.Data.Models;
using ProjectLedg.Server.Repositories;

namespace ProjectLedg.Server.Services
{
    public class AuthenticationService
    {
        private readonly JwtRepository _jwtRepository;

        public AuthenticationService(JwtRepository jwtRepository)
        {
            _jwtRepository = jwtRepository;
        }

        public string GenerateToken(User user)
        {
            try
            {
                return _jwtRepository.GenerateJwt(user);
            }

            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while generating the JWT.", ex);
            }
        }
    }
}
