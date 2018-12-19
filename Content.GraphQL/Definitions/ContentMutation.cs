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

namespace Content.GraphQL.Definitions
{
    public class ContentMutation : ObjectGraphType
    {
        private readonly DataContext dataContext;

        public ContentMutation(DataContext dataContext)
        {
            this.dataContext = dataContext;
            Name = "Mutation";

            Field<SiteType>(
                "upsertSite",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<SiteInputType>> { Name = "site" }
                ),
                resolve: context =>
                {
                    var site = context.GetArgument<Site>("site");
                    return UpsertSite(site);
                }
            );

            FieldAsync<PostType>(
                "upsertPost",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<PostInputType>> { Name = "post" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "siteId" }
                ),
                resolve: async context => {
                    // TODO: rewrite jobject logic to use special input model and map
                    var postArg = JsonConvert.DeserializeObject<JObject>(JsonConvert.SerializeObject(context.GetArgument<object>("post"))); // cheating
                    var post = postArg.ToObject<Post>();
                    var siteId = context.GetArgument<string>("siteId");

                    // upsert the post
                    dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;

                    // remove the slices that aren't in the payload
                    var slicesInDb = await dataContext.Slices.Where(s => EF.Property<string>(s, "PostId") == post.Id).Select(s => s.Id).ToListAsync();
                    var slicesToDelete = slicesInDb.Where(sid => post.Slices.Where(s => s.Id != null).Any(s => s.Id == sid) == false).ToList();
                    dataContext.Slices.RemoveRange(dataContext.Slices.Where(s => slicesToDelete.Contains(s.Id)));
                                        
                    dataContext.Posts.Update(post);
                    await dataContext.SaveChangesAsync();

                    return post;
                }
            );
        }

        private async Task<Post> UpsertPost(Post post, string siteId)
        {
            dataContext.Entry(post).Property("SiteId").CurrentValue = siteId;
            dataContext.Posts.Update(post);
            await dataContext.SaveChangesAsync();
            return post;
        }

        private async Task<Site> UpsertSite(Site site)
        {
            dataContext.Sites.Update(site);
            await dataContext.SaveChangesAsync();
            return site;
        }
    }
}