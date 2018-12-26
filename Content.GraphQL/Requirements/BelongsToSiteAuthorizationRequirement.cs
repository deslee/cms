using System;
using System.Linq;
using System.Threading.Tasks;
using Content.GraphQL.Models;
using Content.GraphQL.Services;
using GraphQL.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Requirements
{
    public class BelongsToSiteAuthorizationRequirement : IAuthorizationRequirement
    {
        private IDataContextProvider dataContextProvider;

        public BelongsToSiteAuthorizationRequirement(IDataContextProvider dataContextProvider)
        {
            this.dataContextProvider = dataContextProvider;
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
            if (!context.Arguments.ContainsKey(siteIdArg)) {
                throw new Exception($"Argument {siteIdArg} not found");
            }
            using (var dataContext = dataContextProvider.Provide())
            {
                var requiredSiteId = context.Arguments[siteIdArg].ToString();
                var belongsToSite = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == requiredSiteId && su.UserId == authenticatedUser.Id);

                if (!belongsToSite) {
                    context.ReportError($"User {authenticatedUser.Email} does not belong to site ${requiredSiteId}.");
                }
            }
        }
    }
}