using System.IO;
using System.Security.Claims;
using GraphQL.Authorization;

namespace Content.GraphQL.Constants {
    public static class Policies
    {
        public static string AdminPolicy = "AdminPolicy";
        public static string Authenticated = "Authenticated";
    }

    public static class Roles
    {
        public static string Admin = "Admin";
    }

    public static class ClaimTypes {
        public static string Email = System.Security.Claims.ClaimTypes.Email;
        public static string Role = System.Security.Claims.ClaimTypes.Role;
        public static string DatabaseId = "content://databaseid";
    }
}