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

            // per-request override request body size limit
            context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null;

            // validate site id
            var userContext = await userContextBuilder.BuildUserContext(context) as UserContext;
            context.Request.Form.TryGetValue("siteId", out var siteIds);
            var siteId = siteIds[0];
            var hasPermission = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
            if (!hasPermission) {
                context.Response.StatusCode = 401;
                return;
            }

            // get form file
            var file = context.Request.Form.Files[0];

            var guid = Guid.NewGuid().ToString();
            var extension = Path.GetExtension(file.FileName);

            var savedFilename = guid + extension;
            // save file to asset directory
            await saveFile(file, Path.Combine(Directory.GetCurrentDirectory(), appSettings.AssetDirectory, savedFilename));

            // save asset to database
            var asset = new Asset
            {
                Id = guid,
                State = "NONE",
                Type = MimeTypes.MimeTypeMap.GetMimeType(extension),
                Data = JObject.FromObject(new
                {
                    extension = extension,
                    originalFilename = file.FileName,
                    key = savedFilename
                })
            };

            dataContext.Entry(asset).Property("SiteId").CurrentValue = siteId;
            dataContext.Assets.Add(asset);
            await dataContext.SaveChangesAsync();

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(asset));
        }

        private async Task saveFile(IFormFile file, string filePath)
        {
            // create directory if it doesn't already exist
            (new FileInfo(filePath)).Directory.Create();

            using (var targetStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(targetStream);
            }
        }
    }
}
