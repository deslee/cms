using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Constants;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Input;
using Content.GraphQL.Models.Result;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Services
{
    public interface ISiteService
    {
        Task<MutationResult<Site>> UpsertSite(SiteInput siteInput, UserContext userContext);
        Task<MutationResult> DeleteSite(string siteId, UserContext userContext);
        Task<Site> GetSite(string id);
        Task<IList<Site>> GetSites(UserContext user);
    }

    public class SiteService : ISiteService
    {
        private readonly DataContext dataContext;
        private readonly ILogger<SiteService> logger;

        public SiteService(DataContext dataContext, ILogger<SiteService> logger)
        {
            this.dataContext = dataContext;
            this.logger = logger;
        }

        public async Task<MutationResult> DeleteSite(string siteId, UserContext userContext)
        {
            // validate
            var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
            if (!validated)
            {
                return new MutationResult<Site>
                {
                    ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                };
            }

            // delete
            var site = await dataContext.Sites.FindAsync(siteId);
            if (site == null)
            {
                return new MutationResult<Site>
                {
                    ErrorMessage = $"Site {siteId} does not exist."
                };
            }
            dataContext.Sites.Remove(site);

            await dataContext.SaveChangesAsync();

            return new MutationResult();
        }

        public async Task<Site> GetSite(string id)
        {
            return await dataContext.Sites
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IList<Site>> GetSites(UserContext userContext)
        {
            return await dataContext.Sites
                .Include(s => s.SiteUsers)
                .Where(s => userContext != null && s.SiteUsers.Any(su => su.UserId == userContext.Id))
                .ToListAsync();
        }

        public async Task<MutationResult<Site>> UpsertSite(SiteInput siteInput, UserContext userContext)
        {
            JObject data;
            try
            {
                data = JsonConvert.DeserializeObject<JObject>(siteInput.Data);
            }
            catch (JsonReaderException ex)
            {
                logger.LogError(ex, "Json parsing exception");
                return new MutationResult<Site>
                {
                    ErrorMessage = "Invalid data json"
                };
            }

            var site = new Site
            {
                Id = siteInput.Id,
                Name = siteInput.Name,
                Data = data
            };

            // validate
            if (siteInput.Id != null)
            {
                var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteInput.Id && su.UserId == userContext.Id);
                if (!validated)
                {
                    return new MutationResult<Site>
                    {
                        ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteInput.Id}."
                    };
                }
            }

            dataContext.Sites.Update(site);


            if (dataContext.Entry(site).State == EntityState.Added)
            {
                // give the creating user permission to the site
                dataContext.SiteUsers.Add(new SiteUser
                {
                    UserId = userContext.Id,
                    SiteId = site.Id
                });
            }

            await dataContext.SaveChangesAsync();
            return new MutationResult<Site>
            {
                Data = site
            };
        }
    }
}