using Microsoft.IdentityModel.Tokens;
using ProjectLedg.Server.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectLedg.Server.Repositories
{
    public class JwtRepository
    {
        public string GenerateJwt(User user)
        {
            try
            {
                // Create Claims
                List<Claim> claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),  // Ensure user.Id is a string
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
            //new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),  // JWT Token ID
            //new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(), ClaimValueTypes.Integer64)  // When it was issued; Security thing
        };

                // Configuration of Token settings
                SymmetricSecurityKey secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")));
                SigningCredentials credentials = new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);

                // Create JWT
                JwtSecurityToken jwt = new JwtSecurityToken(
                    issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
                    audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(3),  // Use UtcNow for consistency across time zones
                    signingCredentials: credentials
                );

                // Serialize token
                var tokenHandler = new JwtSecurityTokenHandler();
                return tokenHandler.WriteToken(jwt);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error generating JWT token", ex);
            }
        }
    }
}
