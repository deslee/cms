using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Content.GraphQL.Models.Input
{
    public class LoginInput
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}