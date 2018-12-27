using System.Collections.Generic;
using System.Linq;
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

        public UserContext(IEnumerable<Claim> claims)
        {
            User = new ClaimsPrincipal(new[] {
                new ClaimsIdentity(claims)
            });
        }

        public ClaimsPrincipal User { get; }
        public string Email => User.Claims.FirstOrDefault(claim => claim.Type == Constants.ClaimTypes.Email)?.Value;
        public string Id => User.Claims.FirstOrDefault(claim => claim.Type == Constants.ClaimTypes.DatabaseId)?.Value;
        public bool IsAdmin => User.Claims.FirstOrDefault(claim => claim.Type == Constants.ClaimTypes.Role)?.Value == Constants.Roles.Admin;
    }
}