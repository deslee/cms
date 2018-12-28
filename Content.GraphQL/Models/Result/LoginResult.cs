using Content.Data.Models;

namespace Content.GraphQL.Models.Result
{
    public class LoginResult : MutationResult<User>
    {
        public string Token { get; set; }
    }
}