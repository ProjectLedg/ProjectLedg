namespace ProjectLedg.Server.Options
{
    public class LoginResult
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string ErrorMessage { get; set; }
        public bool Require2FA { get; set; }
        public List<string> Roles { get; set; }

        private LoginResult(bool success, string token = "", bool require2FA = false, string errorMessage = "", List<string> roles = null)
        {
            Success = success;
            Token = token;
            Require2FA = require2FA;
            ErrorMessage = errorMessage;
            Roles = roles ?? new List<string>();
        }

        public static LoginResult Failed(string message) => new LoginResult(false, errorMessage: message);

        public static LoginResult Successful(string token, List<string> roles) => new LoginResult(true, token, roles: roles);

        public static LoginResult Requires2FA(string token) => new LoginResult(false, token, require2FA: true);
    }
}
