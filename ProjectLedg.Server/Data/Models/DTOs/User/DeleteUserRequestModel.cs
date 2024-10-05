using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Model.DTOs.User
{
    public class DeleteUserRequestModel
    {
        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        [StringLength(256, MinimumLength = 8)]
        public string Password { get; set; }
    }
}
