using System.Linq;
using Content.Data;
using Microsoft.AspNetCore.Http;

namespace Content.GraphQL.Services
{
    public class DatabaseUserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public DatabaseUserAccessor(IHttpContextAccessor httpContextAccessor) {
            this.httpContextAccessor = httpContextAccessor;
        }
        public string GetCurrentUser()
        {
            var userId = httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(c => c.Type == Constants.ClaimTypes.DatabaseId)?.Value;
            return userId;
        }
    }
}