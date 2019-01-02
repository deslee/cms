using System;
using System.IO;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models;
using GraphQL.Server.Transports.AspNetCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Middleware
{
    public class ViewAssetMiddleware
    {
        private readonly RequestDelegate next;
        private readonly PathString path;

        public ViewAssetMiddleware(RequestDelegate next, PathString path) {
            this.next = next;
            this.path = path;
        }

        public async Task InvokeAsync(HttpContext context, DataContext dataContext, AppSettings appSettings, IUserContextBuilder userContextBuilder)
        {
            if (!context.Request.Path.StartsWithSegments(path))
            {
                await next.Invoke(context);
                return;
            }

            var fileName = context.Request.Path.ToString().Substring(this.path.ToString().Length).Replace("/", "");

            var id = Path.GetFileNameWithoutExtension(fileName);
            var asset = await dataContext.Assets.FindAsync(id);

            if (asset == null) {
                context.Response.StatusCode = 404;
                return;
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), appSettings.AssetDirectory, fileName);

            if (!(new FileInfo(filePath)).Exists) {
                context.Response.StatusCode = 404;
                return;
            }

            context.Response.ContentType = asset.Type;

            await context.Response.SendFileAsync(filePath);
        }
    }
}