using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;
using Serilog.Context;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Content.Asset.Job
{


    public interface IAssetProcessor
    {
        Task Run();
    }

    public class AssetProcessor : IAssetProcessor
    {
        private readonly Func<DataContext> dataContextFactory;
        private readonly string assetDirectoryPath;

        public AssetProcessor(Func<DataContext> dataContextFactory, string assetDirectoryPath)
        {
            this.dataContextFactory = dataContextFactory;
            this.assetDirectoryPath = assetDirectoryPath;
        }

        public async Task Run()
        {
            try {
                using (var dataContext = dataContextFactory())
                {
                    var assets = dataContext.Assets
                        .Where(asset => asset.State == "NONE");

                    foreach (var asset in assets)
                    {
                        try
                        {
                            ProcessAsset(asset);
                            dataContext.Update(asset);
                        }
                        catch (Exception ex)
                        {
                            Log.Error(ex, "Caught an error while processing asset " + asset.Id);
                        }
                    }
                    await dataContext.SaveChangesAsync();
                }
            }
            catch (Exception ex) {
                Log.Error(ex, "Caught an error in job runner");
            }
        }

        private void ProcessAsset(Data.Models.Asset asset)
        {
            using (LogContext.PushProperty("assetId", asset.Id))
            {
                Log.Information("Processing asset " + asset.Id);
                var extension = asset.Data.GetValue("extension");
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), assetDirectoryPath, asset.Id + extension);
                if (!new FileInfo(filePath).Exists)
                {
                    throw new Exception("File does not exist for asset " + asset.Id);
                }

                using (var input = File.OpenRead(filePath))
                {
                    using (var image = Image.Load(input))
                    {
                        Log.Information("Loaded asset " + asset.Id);
                        var sizes = new JObject();
                        foreach (int w in Widths)
                        {
                            var width = Math.Min(w, image.Width);
                            var key = $"{asset.Id}-{width}{extension}";
                            var outputFilePath = Path.Combine(Directory.GetCurrentDirectory(), assetDirectoryPath, key);
                            Log.Information($"writing {outputFilePath}");

                            var widthHeightRatio = ((decimal)image.Height / image.Width);

                            var resizedImage = image.Clone();
                            resizedImage.Mutate(c => c.Resize(width, (int) Math.Round(width * widthHeightRatio)));
                            resizedImage.Save(outputFilePath);
                            Log.Information($"wrote {outputFilePath}");
                            sizes.Add(width.ToString(), key);
                        }

                        // gotta do this so EF will track the change
                        var data = asset.Data;
                        data["sizes"] = sizes;
                        asset.Data = data;
                    }
                }
                asset.State = "RESIZED";
            }
        }

        private static readonly int[] Widths = new int[] { 1200, 500, 320 };
    }
}
