using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.GraphQL.Annotations;

namespace Content.GraphQL.Models.Input
{
    public class RegisterInput
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        [MapsToData]
        public string Name { get; set; }
    }
}