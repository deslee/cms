using System;
using System.Threading.Tasks;
using Content.GraphQL.Definitions.Types;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Content.Data;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Content.GraphQL.Definitions.Types.Input;
using Content.GraphQL.Models.Input;
using AutoMapper;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Configuration;
using Content.GraphQL.Services;

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly IAuthenticationService authenticationService;
        private readonly DataContext dataContext;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;

        public ContentMutation(IAuthenticationService authenticationService, DataContext dataContext, IMapper mapper, IConfiguration configuration)
        {
            this.authenticationService = authenticationService;
            this.dataContext = dataContext;
            this.mapper = mapper;
            this.configuration = configuration;
            Name = "Mutation";

            FieldAsync<SiteType>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: async context =>
                {
                    var siteInput = context.GetArgument<SiteInput>("site");
                    var site = mapper.Map<Site>(siteInput);

                    dataContext.Sites.Update(site);
                    await dataContext.SaveChangesAsync();
                    return site;
                }
            );

            FieldAsync<PostType>(
                "upsertPost",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: async context =>
                {
                    var postInput = context.GetArgument<PostInput>("post");
                    var post = mapper.Map<Post>(postInput);
                    var siteId = context.GetArgument<string>("siteId");

                    // set the "SiteId" shadow property
                    dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;

                    // remove groups in post that are not in payload
                    var foundGroupsInPost = await dataContext.PostGroups.Where(pg => pg.PostId == post.Id).ToListAsync();
                    var groupsToDeleteFromPost =
                        foundGroupsInPost.Where(fc => post.PostGroups.FirstOrDefault(x => x.GroupId == fc.GroupId) == null).ToList();
                    dataContext.PostGroups.RemoveRange(groupsToDeleteFromPost);

                    var allGroupsInSite = await dataContext.Groups.Where(c => EF.Property<string>(c, "SiteId") == siteId).ToListAsync();

                    // assign group ids to groups with the same names
                    foreach (PostGroup pg in post.PostGroups)
                    {
                        var foundGroupInSite = allGroupsInSite.FirstOrDefault(g => g.Name == pg.Group.Name);
                        if (foundGroupInSite != null)
                        {
                            pg.GroupId = foundGroupInSite.Id;
                            pg.Group.Id = foundGroupInSite.Id;
                        }
                        dataContext.Entry(pg.Group).Property("SiteId").CurrentValue = siteId;
                    }

                    // remove groups from site that no longer have posts
                    foreach (var group in allGroupsInSite)
                    {
                        var count = await dataContext.PostGroups.Where(pg => pg.GroupId == group.Id).CountAsync();
                        if (count == 0)
                        {
                            dataContext.Groups.Remove(group);
                        }
                    }

                    dataContext.Update(post);
                    await dataContext.SaveChangesAsync();
                    return post;
                }
            );

            FieldAsync<UserType>(
                "register",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<RegisterInputType>> { Name = "registration" }
                ),
                resolve: async context =>
                {
                    var registerInput = context.GetArgument<RegisterInput>("registration");
                    return await authenticationService.RegisterUser(registerInput);
                }
            );

            FieldAsync<UserType>(
                "login",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<LoginInputType>> { Name = "login" }
                ),
                resolve: async context =>
                {
                    var loginInput = context.GetArgument<LoginInput>("login");
                    return await authenticationService.Login(loginInput);
                }
            );
        }
    }
}