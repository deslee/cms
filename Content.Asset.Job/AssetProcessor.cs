using System;
using System.IO;
using Content.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Content.Asset.Job
{


    public interface IAssetProcessor {

    }

    public class AssetProcessor: IAssetProcessor
    {
        private readonly Func<DataContext> dataContextFactory;

        public AssetProcessor(Func<DataContext> dataContextFactory) {
            this.dataContextFactory = dataContextFactory;

            using (var dataContext = dataContextFactory()) {
                var sites = dataContext.Sites.ToListAsync().GetAwaiter().GetResult();
                Console.WriteLine(sites.Count);
            }
        }
    }
}
