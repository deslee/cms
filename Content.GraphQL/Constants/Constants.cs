using System.Security.Claims;
using GraphQL.Authorization;

namespace Content.GraphQL.Constants {
    public static class Policies
    {
        public static string AdminPolicy = "AdminPolicy";
        public static string BelongsToSite = "BelongsToSite";
        public static string Authenticated = "Authenticated";
    }

    public static class Roles
    {
        public static string Admin = "Admin";
    }
}