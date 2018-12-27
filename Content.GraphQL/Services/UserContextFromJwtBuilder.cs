using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models;
using GraphQL.Authorization;
using GraphQL.Server.Transports.AspNetCore;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Content.GraphQL.Services
{
    public class UserContextFromJwtBuilder : IUserContextBuilder
    {
        public async Task<object> BuildUserContext(HttpContext httpContext)
        {
            var userService = httpContext.RequestServices.GetRequiredService<IUserService>();

            var userId = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == Constants.ClaimTypes.DatabaseId)?.Value;
            if (userId == null)
            {
                return new UserContext();
            }
            var user = await userService.GetUserById(userId);
            if (user == null) {
                return new UserContext();
            }
            var moreClaims = await userService.GetClaimsForUser(user);
            return new UserContext(httpContext.User.Claims.Concat(moreClaims));
        }
    }
}