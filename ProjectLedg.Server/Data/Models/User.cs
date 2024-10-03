using Microsoft.AspNetCore.Identity;

namespace ProjectLedg.Server.Data.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual ICollection <Company>? Companies { get; set; }
    }
}
