﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ProjectLedg.Server.Data.Models
{
    public class User : IdentityUser
    {
        //this is a comment about FirstNames
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? AuthenticatorKey { get; set; }

        public virtual ICollection <Company>? Companies { get; set; }
    }
}
