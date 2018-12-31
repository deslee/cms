using System;
using System.Security.Claims;
using System.Text;
using Content.Data;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Middleware;
using Content.GraphQL.Helpers;
using Content.GraphQL.Services;
using GraphQL;
using GraphQL.Authorization;
using GraphQL.Server;
using GraphQL.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Content.GraphQL {
    public static class ServiceCollectionExtensions {

        public static void AddCustomAuthentication(this IServiceCollection services, AppSettings appSettings) {
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.Secret)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    options.IncludeErrorDetails = true;
                });
        }
        
        public static void AddCustomGraphQL<T>(this IServiceCollection services) {
            services.AddTransient<ContentSchema>(s => new ContentSchema(new FuncDependencyResolver(s.GetRequiredService)));
            services.AddTransient<ContentQuery>();
            services.AddTransient<ContentMutation>();

            var types = typeof(T).Assembly.GetTypes();
            foreach (Type type in types)
            {
                if (type.Namespace != null && type.Namespace.StartsWith(typeof(T).Namespace))
                {
                    services.AddTransient(type);
                }
            }

            // add auth rules
            services.AddTransient<IAuthorizationEvaluator, AuthorizationEvaluator>();
            services.AddTransient<IValidationRule, AuthorizationValidationRule>();
            services.AddTransient<AuthorizationSettings, ContentAuthorizationSettings>();

            // add field middleware
            services.AddTransient<IFieldMiddleware, LoggingMiddleware>();

            // Add GraphQL services and configure options
            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                options.ExposeExceptions = false;
            })
            .AddUserContextBuilder<UserContextFromJwtBuilder>();
        }

        public static void AddCustomServices(this IServiceCollection services) {
            services.AddTransient<IUserAccessor, DatabaseUserAccessor>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ISiteService, SiteService>();
            services.AddTransient<IItemService, ItemService>();
            services.AddTransient<IMutationExecutionHelper, MutationExecutionHelper>();
        }
    }
}