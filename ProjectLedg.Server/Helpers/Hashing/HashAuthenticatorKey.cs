using System.Security.Cryptography;
using System.Text;

namespace ProjectLedg.Server.Helpers.Hashing
{
    public static class AuthenticatorHelper
    {
        public static string HashAuthenticatorKey(string key)
        {
            //retrieving salt from env file
            var salt = Environment.GetEnvironmentVariable("AUTHENTICATOR_HASH_SALT");

            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(salt)))
            {
                var keyBytes = Encoding.UTF8.GetBytes(key);
                var hashedKey = hmac.ComputeHash(keyBytes);
                return Convert.ToBase64String(hashedKey);
            }
        }
    }
}
