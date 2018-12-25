using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Content.GraphQL.MapperProfiles;
using CorrelationId;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Context;
using Serilog.Events;

namespace Content.GraphQL
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCorrelationId();
            services.AddTransient<ContentSchema>(s => new ContentSchema(new FuncDependencyResolver(s.GetRequiredService)));
            services.AddTransient<ContentQuery>();
            services.AddTransient<ContentMutation>();
            var types = typeof(ContentSchema).Assembly.GetTypes();
            foreach (Type type in types)
            {
                if (type.Namespace != null && type.Namespace.StartsWith(typeof(SiteType).Namespace))
                {
                    services.AddTransient(type);
                }
            }

            AddMapper(services);

            services.AddDbContext<DataContext>(optionsAction: ConfigureDatabase);
            MigrateDatabase();

            // Add GraphQL services and configure options
            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                options.ExposeExceptions = true;
            });
        }

        private void AddMapper(IServiceCollection services)
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ContentMapperProfile>());
            var mapper = config.CreateMapper();
            services.AddSingleton<IMapper>(mapper);
        }

        private void MigrateDatabase()
        {
            var builder = new DbContextOptionsBuilder<DataContext>();
            ConfigureDatabase(builder);
            var dataContext = new DataContext(builder.Options);
            dataContext.Database.Migrate();
        }

        private void ConfigureDatabase(DbContextOptionsBuilder builder)
        {
            builder.UseSqlite("Data Source=content.db");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCorrelationId(new CorrelationIdOptions
            {
                Header = "X-Correlation-ID",
                UseGuidForCorrelationId = true,
                UpdateTraceIdentifier = false
            });
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use(async (context, next) =>
            {
                var correlationContext = context.RequestServices.GetService<ICorrelationContextAccessor>();
                using (LogContext.PushProperty("XCorrelationID", correlationContext.CorrelationContext.CorrelationId)) {
                    await next.Invoke();
                }
            });

            app.UseGraphQL<ContentSchema>("/graphql");
            // use graphql-playground middleware at default url /ui/playground
            app.UseGraphQLPlayground(new GraphQLPlaygroundOptions());

            app.Run(async (context) =>
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
