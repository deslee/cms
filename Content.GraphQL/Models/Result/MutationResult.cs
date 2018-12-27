namespace Content.GraphQL.Models.Result
{
    public class MutationResult
    {
        public bool Success => string.IsNullOrEmpty(ErrorMessage);
        public string ErrorMessage { get; set; }
    }
    public class MutationResult<S>: MutationResult
    {
        public S Data { get; set; }
    }
}