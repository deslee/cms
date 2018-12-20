using System;
using System.Collections;
using System.Collections.Generic;
using AutoMapper;
using Content.Data;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Content.GraphQL.MapperProfiles;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ninject;
using Xunit;

namespace Content.GraphQL.Tests
{
    public class BasicTest
    {
        private readonly ContentSchema contentSchema;

        public BasicTest()
        {
            IKernel kernel = new StandardKernel();

            var dataContext = new DataContext(new DbContextOptionsBuilder<DataContext>()
                .UseSqlite("Data Source=content.tests.db").Options);

            dataContext.Database.EnsureDeleted();
            dataContext.Database.Migrate();

            kernel.Bind<IMapper>().ToConstant(new MapperConfiguration(cfg => cfg.AddProfile<ContentMapperProfile>()).CreateMapper());
            kernel.Bind<DataContext>().ToConstant(dataContext);
            kernel.Bind<ContentQuery>().ToSelf();
            kernel.Bind<ContentMutation>().ToSelf();
            kernel.Bind<ContentSchema>().ToConstant(new ContentSchema(new FuncDependencyResolver(resolver: type => kernel.Get(type))));

            foreach (Type type in typeof(ContentSchema).Assembly.GetTypes())
            {
                if (type.Namespace.StartsWith(typeof(SiteType).Namespace))
                {
                    kernel.Bind(type).ToSelf();
                }
            }

            contentSchema = kernel.Get<ContentSchema>();
        }

        [Fact]
        public void GetSites_ReturnsEmptySite()
        {
            var data = Execute(@"
                    query getSites {
                        sites {
                            id,
                            name
                        }
                    }
                ");
            Assert.Equal(JTokenType.Object, data.Type);
            Assert.True(((JObject)data).TryGetValue("sites", out JToken jSites));
            Assert.Equal(JTokenType.Array, jSites.Type);
            var sites = jSites.ToObject<IList<SiteType>>();
            Assert.Equal(0, sites.Count);
        }


        [Fact]
        public void GetSites_ReturnsSite()
        {
            var command = Execute(@"
                mutation createSite($site: SiteInput!) {
                    upsertSite(site: $site) {
                        id
                    }
                }
            ",
            new Dictionary<string, object>
            {
                { "site", 
                    new Dictionary<string, object> {
                        { "name", "Desmond's Website" }
                    }
                }
            });
        }

        private JToken Execute(string query, Dictionary<string, object> inputs = null)
        {
            var json = contentSchema.Execute(_ =>
            {
                _.Query = query;
                _.Inputs = inputs != null ? new Inputs(inputs) : null;
            });
            var response = JsonConvert.DeserializeObject<JObject>(json);
            Assert.True(response.TryGetValue("data", out JToken data));
            Assert.Equal(JTokenType.Object, response.Type);
            return data;
        }
    }
}
