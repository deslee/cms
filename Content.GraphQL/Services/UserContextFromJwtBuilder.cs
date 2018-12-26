using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Content.Data;
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
            return await httpContext.RequestServices.GetRequiredService<IAuthenticationService>().GetUser(httpContext);
        }
    }
}