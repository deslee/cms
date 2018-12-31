using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.GraphQL.Definitions.Types;

namespace Content.GraphQL.Models.Input
{
    public class RegisterInput
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
    }
}