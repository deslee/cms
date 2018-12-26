using System;
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

namespace Content.GraphQL.Services
{
    public interface ISiteService
    {
        Task<Site> upsertSite(SiteInput siteInput);
    }

    public class SiteService : ISiteService
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public SiteService(DataContext dataContext, IMapper mapper) {
            this.dataContext = dataContext;
            this.mapper = mapper;
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