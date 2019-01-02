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
    public class UploadAssetMiddleware
    {
        private readonly RequestDelegate next;
        private readonly PathString path;

        public UploadAssetMiddleware(RequestDelegate next, PathString path) {
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

            context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null;

            var userContext = await userContextBuilder.BuildUserContext(context) as UserContext;
            context.Request.Form.TryGetValue("siteId", out var siteIds);
            var siteId = siteIds[0];
            var hasPermission = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);

            var file = context.Request.Form.Files[0];
            var guid = Guid.NewGuid().ToString();
            var extension = Path.GetExtension(file.FileName);
            var fileName = guid + extension;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), appSettings.AssetDirectory, fileName);
            // create directory if it doesn't already exist
            (new FileInfo(filePath)).Directory.Create();

            using (var targetStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(targetStream);
            }

            var asset = new Asset
            {
                Id = guid,
                State = "NONE",
                Type = MimeTypes.MimeTypeMap.GetMimeType(extension),
                Data = JObject.FromObject(new
                {
                    extension = extension
                })
            };

            dataContext.Entry(asset).Property("SiteId").CurrentValue = siteId;
            dataContext.Assets.Add(asset);
            await dataContext.SaveChangesAsync();

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(asset));
        }
    }
}
