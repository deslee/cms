using System.Collections.Generic;
using System.Security.Claims;
using Content.Data.Models;
using GraphQL.Authorization;

namespace Content.GraphQL.Models
{
    public class UserContext : IProvideClaimsPrincipal
    {
        public UserContext()
        {
            User = new ClaimsPrincipal();
        }

        public UserContext(User user, IEnumerable<Claim> claims)
        {
            AuthenticatedUser = user;
            User = new ClaimsPrincipal(new[] {
                new ClaimsIdentity(claims)
            });
        }

        public ClaimsPrincipal User { get; }
        public User AuthenticatedUser { get; set; }
    }
}