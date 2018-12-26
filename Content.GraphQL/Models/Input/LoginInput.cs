using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.GraphQL.Annotations;

namespace Content.GraphQL.Models.Input
{
    public class LoginInput
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}