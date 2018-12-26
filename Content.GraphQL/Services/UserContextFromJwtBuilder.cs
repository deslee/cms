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


            var email = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return new UserContext();
            }
            var user = await userService.GetUserByEmail(email);
            if (user == null) {
                return new UserContext();
            }
            var moreClaims = await userService.GetClaimsForUser(user);
            return new UserContext(user, httpContext.User.Claims.Concat(moreClaims));
        }
    }
}