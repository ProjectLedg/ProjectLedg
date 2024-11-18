namespace ProjectLedg.Server.Data.Models.DTOs.User
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public IEnumerable<string>? Roles { get; set; }
        public IEnumerable<string>? Claims { get; set; }
    }
}
