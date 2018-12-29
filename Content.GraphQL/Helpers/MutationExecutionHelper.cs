using System;
using System.Threading.Tasks;
using Content.GraphQL.Models.Result;
using Microsoft.Extensions.Logging;

namespace Content.GraphQL.Helpers
{
    public interface IMutationExecutionHelper
    {
        Task<T> ExecuteSafely<T>(Func<Task<T>> action) where T : MutationResult;
    }

    public class MutationExecutionHelper : IMutationExecutionHelper
    {
        private readonly ILogger<MutationExecutionHelper> logger;

        public MutationExecutionHelper(ILogger<MutationExecutionHelper> logger)
        {
            this.logger = logger;
        }

        public async Task<T> ExecuteSafely<T>(Func<Task<T>> action) where T : MutationResult
        {
            try
            {
                return await action();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured while deleting a site");
                var t = Activator.CreateInstance(typeof(T)) as T;
                t.ErrorMessage = "An unexpected error occured. Please try again.";
                return t;
            }
        }
    }
}