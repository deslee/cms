using System.Threading.Tasks;
using Content.Data;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Result;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Content.GraphQL.Services
{
    public interface IAssetService
    {
        Task<MutationResult> DeleteAsset(string assetId, UserContext userContext);
    }

    public class AssetService : IAssetService
    {
        private readonly DataContext dataContext;
        private readonly ILogger<AssetService> logger;

        public AssetService(DataContext dataContext, ILogger<AssetService> logger) {
            this.dataContext = dataContext;
            this.logger = logger;
        }
        public async Task<MutationResult> DeleteAsset(string assetId, UserContext userContext)
        {
            // fetch
            var asset = await dataContext.Assets.FirstOrDefaultAsync(a => a.Id == assetId);

            if (asset == null) {
                return new MutationResult {
                    ErrorMessage = $"Asset {assetId} does not exist"
                };
            }

            var siteId = dataContext.Entry(asset).Property("SiteId").CurrentValue as string;

            // validate
            var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
            if (!validated)
            {
                return new MutationResult
                {
                    ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                };
            }

            dataContext.Assets.Remove(asset);
            await dataContext.SaveChangesAsync();
            return new MutationResult();
        }
    }
}