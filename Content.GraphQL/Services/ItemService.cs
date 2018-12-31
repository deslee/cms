using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
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
    public interface IItemService
    {
        Task<MutationResult<Item>> UpsertItem(ItemInput itemInput, UserContext userContext, string siteId);
        Task<IList<Item>> GetItems(string siteId);
        Task<MutationResult> DeleteItem(string itemId, UserContext userContext);
        Task<Item> GetItem(string itemId);
    }

    public class ItemService : IItemService
    {
        private readonly DataContext dataContext;
        private readonly ILogger<ItemService> logger;

        public ItemService(DataContext dataContext, ILogger<ItemService> logger)
        {
            this.dataContext = dataContext;
            this.logger = logger;
        }

        public async Task<MutationResult> DeleteItem(string itemId, UserContext userContext)
        {
            // find item
            var item = await dataContext.Items.FindAsync(itemId);
            if (item == null)
            {
                return new MutationResult<Site>
                {
                    ErrorMessage = $"Item {itemId} does not exist."
                };
            }
            var siteId = dataContext.Entry(item).Property("SiteId").CurrentValue as string;

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
            dataContext.Items.Remove(item);

            await dataContext.SaveChangesAsync();

            return new MutationResult();
        }

        public async Task<Item> GetItem(string itemId)
        {
            return await dataContext.Items.FindAsync(itemId);
        }

        public async Task<IList<Item>> GetItems(string siteId)
        {
            return await dataContext.Items
                .Where(p => EF.Property<string>(p, "SiteId") == siteId)
                .ToListAsync();
        }

        public async Task<MutationResult<Item>> UpsertItem(ItemInput itemInput, UserContext userContext, string siteId)
        {
            JObject data;
            try
            {
                data = JsonConvert.DeserializeObject<JObject>(itemInput.Data);
            }
            catch (JsonReaderException ex)
            {
                logger.LogError(ex, "Json parsing exception");
                return new MutationResult<Item>
                {
                    ErrorMessage = "Invalid data json"
                };
            }

            var item = new Item
            {
                Id = itemInput.Id,
                Type = itemInput.Type,
                Data = data
            };
            item.ItemGroups = itemInput.Groups?.Select(groupName => new ItemGroup
            {
                Item = item,
                ItemId = item.Id,
                Group = new Group
                {
                    Name = groupName
                }
            }).ToList();

            // validate authenticated user belogns to site
            var validated = await dataContext.SiteUsers.AnyAsync(su => su.SiteId == siteId && su.UserId == userContext.Id);
            if (!validated)
            {
                return new MutationResult<Item>
                {
                    ErrorMessage = $"User {userContext?.Email} has no permission to update site {siteId}."
                };
            }

            // set the "SiteId" shadow property
            dataContext.Entry(item).Property("SiteId").CurrentValue = siteId;

            // remove groups in item that are not in payload
            var foundGroupsInItem = await dataContext.ItemGroups.Where(pg => pg.ItemId == item.Id).ToListAsync();
            var groupsToDeleteFromItem =
                foundGroupsInItem.Where(fc => item.ItemGroups.FirstOrDefault(x => x.GroupId == fc.GroupId) == null).ToList();
            dataContext.ItemGroups.RemoveRange(groupsToDeleteFromItem);

            var allGroupsInSite = await dataContext.Groups.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();

            // assign group ids to groups with the same names
            foreach (ItemGroup pg in item.ItemGroups)
            {
                var foundGroupInSite = allGroupsInSite.FirstOrDefault(g => g.Name == pg.Group.Name);
                if (foundGroupInSite != null)
                {
                    pg.GroupId = foundGroupInSite.Id;
                    pg.Group.Id = foundGroupInSite.Id;
                }
                dataContext.Entry(pg.Group).Property("SiteId").CurrentValue = siteId;
            }

            // remove groups from site that no longer have items
            foreach (var group in allGroupsInSite)
            {
                var count = await dataContext.ItemGroups.Where(pg => pg.GroupId == group.Id).CountAsync();
                if (count == 0)
                {
                    dataContext.Groups.Remove(group);
                }
            }

            dataContext.Update(item);
            await dataContext.SaveChangesAsync();
            return new MutationResult<Item>
            {
                Data = item
            };
        }
    }
}