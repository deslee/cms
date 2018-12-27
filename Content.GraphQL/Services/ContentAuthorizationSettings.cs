using System.Security.Claims;
using System.Threading.Tasks;
using Content.Data;
using Content.GraphQL.Constants;
using Content.GraphQL.Requirements;
using GraphQL.Authorization;

namespace Content.GraphQL.Services
{
    public class ContentAuthorizationSettings : AuthorizationSettings
    {
        public ContentAuthorizationSettings(DataContext dataContext)
        {
            AddPolicy(Content.GraphQL.Constants.Policies.AdminPolicy, _ => _.RequireClaim(ClaimTypes.Role, Roles.Admin));
            AddPolicy(Content.GraphQL.Constants.Policies.BelongsToSite, _ => _.AddRequirement(new BelongsToSiteAuthorizationRequirement(dataContext)));
        }
    }
}