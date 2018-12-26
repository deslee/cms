using System.Security.Claims;
using Content.GraphQL.Constants;
using GraphQL.Authorization;

namespace Content.GraphQL.Services
{
    public class ContentAuthorizationSettings : AuthorizationSettings
    {
        public ContentAuthorizationSettings()
        {
            AddPolicy(Content.GraphQL.Constants.Policies.AdminPolicy, _ => _.RequireClaim(ClaimTypes.Role, Roles.Admin));
        }
    }
}