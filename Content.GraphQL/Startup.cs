using System;
using System.IO;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Content.GraphQL.Middleware;
using Content.GraphQL.Models;
using Content.GraphQL.Services;
using CorrelationId;
using GraphQL.Server;
using GraphQL.Server.Transports.AspNetCore;
using GraphQL.Server.Ui.Playground;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using Serilog;
using Serilog.Context;
using Serilog.Events;

namespace Content.GraphQL
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(corsOptions => corsOptions.AddPolicy("AllowAllOrigins", policyBuilder => policyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            var builder = new DbContextOptionsBuilder<DataContext>();
            ConfigureDatabase(builder);
            MigrateDatabase(builder.Options);

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            var appSettings = appSettingsSection.Get<AppSettings>();
            services.AddSingleton(appSettings);

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Seq(serverUrl: appSettings.SeqUrl, apiKey: appSettings.SeqApiKey)
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {XCorrelationID} {Message:lj}{NewLine}{Exception}")
                .CreateLogger();

            services.Configure<FormOptions>(options => {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = long.MaxValue;
            });

            services.AddCustomAuthentication(appSettings);
            services.AddCorrelationId();
            services.AddDbContext<DataContext>(optionsAction: ConfigureDatabase);
            services.AddCustomGraphQL<SiteType>();
            services.AddHttpContextAccessor();
            services.AddCustomServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors("AllowAllOrigins");

            app.UseAuthentication();
            app.UseCorrelationId(new CorrelationIdOptions
            {
                Header = "X-Generated-Correlation-ID",
                UseGuidForCorrelationId = true,
                UpdateTraceIdentifier = false
            });

            app.Use(async (context, next) =>
            {
                var correlationContext = context.RequestServices.GetService<ICorrelationContextAccessor>();
                using (LogContext.PushProperty("GeneratedCorrelationID", correlationContext.CorrelationContext.CorrelationId))
                {
                    await next.Invoke();
                }
            });

            app.UseGraphQL<ContentSchema>("/graphql");
            app.UseMiddleware<ViewAssetMiddleware>(new PathString("/asset"));
            app.UseMiddleware<UploadAssetMiddleware>(new PathString("/uploadAsset"));

            // use graphql-playground middleware at default url /ui/playground
            app.UseGraphQLPlayground(new GraphQLPlaygroundOptions());
        }

        private void MigrateDatabase(DbContextOptions options)
        {
            var dataContext = new DataContext(options, new SystemUserAccessor());
            dataContext.Database.Migrate();
        }

        protected static internal void ConfigureDatabase(DbContextOptionsBuilder builder)
        {
            builder.UseSqlite("Data Source=content.db");
        }
    }
}
