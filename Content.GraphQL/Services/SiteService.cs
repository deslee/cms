using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Models.Input;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Content.GraphQL.Services
{
    public interface ISiteService
    {
        Task<Site> upsertSite(SiteInput siteInput);
        Task<Site> GetSite(string id);
        Task<IList<Site>> GetSites(User user);
    }

    public class SiteService : ISiteService
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;
        private readonly ILogger<SiteService> logger;

        public SiteService(DataContext dataContext, IMapper mapper, ILogger<SiteService> logger)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<Site> GetSite(string id)
        {
            return await dataContext.Sites
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IList<Site>> GetSites(User user)
        {
            logger.LogError("Errors? nah jk");
            return await dataContext.Sites
                .Include(s => s.SiteUsers)
                .Where(s => s.SiteUsers != null && s.SiteUsers.Any(su => su.UserId == user.Id))
                .ToListAsync();
        }

        public async Task<Site> upsertSite(SiteInput siteInput)
        {
            var site = mapper.Map<Site>(siteInput);

            dataContext.Sites.Update(site);
            await dataContext.SaveChangesAsync();
            return site;
        }
    }
}