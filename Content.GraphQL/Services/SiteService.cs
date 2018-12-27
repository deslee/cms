using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
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

namespace Content.GraphQL.Services
{
    public interface ISiteService
    {
        Task<MutationResult<Site>> upsertSite(SiteInput siteInput);
        Task<Site> GetSite(string id);
        Task<IList<Site>> GetSites(UserContext user);
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

        public async Task<IList<Site>> GetSites(UserContext userContext)
        {
            return await dataContext.Sites
                .Include(s => s.SiteUsers)
                .Where(s => userContext.AuthenticatedUser != null && s.SiteUsers.Any(su => su.UserId == userContext.AuthenticatedUser.Id))
                .ToListAsync();
        }

        public async Task<MutationResult<Site>> upsertSite(SiteInput siteInput)
        {
            var site = mapper.Map<Site>(siteInput);
            var emails = siteInput.Users.Select(e => e.ToLower());
            
            var userIds = await dataContext.Users.Where(u => emails.Contains(u.Email)).Select(u => u.Id).ToListAsync();

            dataContext.Sites.Update(site);
            var siteUsers = userIds.Select(userId => new SiteUser {
                UserId = userId,
                SiteId = site.Id
            }).ToList();

            foreach(var siteUser in siteUsers) {
                if (!(await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteUser.SiteId && su.UserId == siteUser.UserId))) {
                    dataContext.SiteUsers.Add(siteUser);
                }
            }

            await dataContext.SaveChangesAsync();
            return new MutationResult<Site> {
                Data = site
            };
        }
    }
}