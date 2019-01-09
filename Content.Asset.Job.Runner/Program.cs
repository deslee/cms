using System;
using System.IO;
using System.Threading;
using Content.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace Content.Asset.Job.Runner
{
    class Program
    {
        static void Main(string[] args)
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile($"appsettings.{environment}.json", optional: false, reloadOnChange: true)
                .Build();

            var options = new DbContextOptionsBuilder().UseSqlite(configuration.GetConnectionString("OperationalDatabase")).Options;

            var appSettings = configuration.GetSection("AppSettings");

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .Enrich.FromLogContext()
                .WriteTo.Seq(serverUrl: appSettings.GetValue<string>("SeqUrl"), apiKey: appSettings.GetValue<string>("SeqApiKey"))
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {assetId} {Message:lj}{NewLine}{Exception}")
                .CreateLogger();

            IAssetProcessor processor = new AssetProcessor(() => new DataContext(options, new SystemUserAccessor()), appSettings.GetValue<string>("AssetDirectory"));

            Log.Logger.Information("Starting Content Asset Job Runner");
            while(true) {
                processor.Run();
                Thread.Sleep(1000);
            }
        }
    }
}
