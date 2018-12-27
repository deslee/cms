namespace Content.GraphQL.Models.Result
{
    public class MutationResult<S>
    {
        public bool Success => string.IsNullOrEmpty(ErrorMessage);
        public string ErrorMessage { get; set; }
        public S Data { get; set; }
    }
}