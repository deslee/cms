using System;
using System.IO;
using Content.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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

            var processor = new AssetProcessor(() => new DataContext(options, new SystemUserAccessor()));
        }
    }
}
