using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Content.GraphQL
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<ContentSchema>(s => new ContentSchema(new FuncDependencyResolver(s.GetRequiredService)));

            services.AddSingleton<ContentQuery>();
            services.AddSingleton<ContentMutation>();
            services.AddSingleton<SiteInputType>();
            services.AddSingleton<SiteType>();

            // Add GraphQL services and configure options
            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                options.ExposeExceptions = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseGraphQL<ContentSchema>("/graphql");
                app.UseGraphQLPlayground(new GraphQLPlaygroundOptions());
            }

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
