using System;
using System.Linq;
using System.Threading.Tasks;
using Content.Data;
using Content.GraphQL.Models;
using Content.GraphQL.Services;
using GraphQL.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Requirements
{
    public class BelongsToSiteAuthorizationRequirement : IAuthorizationRequirement
    {
        private readonly DataContext dataContext;

        public BelongsToSiteAuthorizationRequirement(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task Authorize(AuthorizationContext context)
        {
            var authenticatedUser = (context.UserContext as UserContext)?.AuthenticatedUser;
            const string siteIdArg = "siteId";
            if (authenticatedUser == null)
            {
                context.ReportError($"User not found");
                return;
            }
            if (context.Arguments == null || !context.Arguments.ContainsKey(siteIdArg))
            {
                throw new Exception($"Argument {siteIdArg} not found");
            }
            var requiredSiteId = context.Arguments[siteIdArg].ToString();
            var belongsToSite = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == requiredSiteId && su.UserId == authenticatedUser.Id);

            if (!belongsToSite)
            {
                context.ReportError($"User {authenticatedUser.Email} does not belong to site ${requiredSiteId}.");
            }
        }
    }
}