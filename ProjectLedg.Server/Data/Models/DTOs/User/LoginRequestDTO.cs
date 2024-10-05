using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Model.DTOs.User
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
    }
}
