using System.Collections.Generic;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Newtonsoft.Json.Linq;
using Xunit;
using Content.GraphQL.Tests.Extensions;

namespace Content.GraphQL.Tests
{
    public class BasicTest
    {
        private readonly ContentSchema contentSchema;

        public BasicTest()
        {
            contentSchema = ContentSchemaFactory.CreateContentSchema();
        }

        [Fact]
        public void GetSites_ReturnsEmptySite()
        {
            var data = contentSchema.ExecuteQueryAndAssert(@"
                    query getSites {
                        sites {
                            id,
                            name
                        }
                    }
                ");
            Assert.True(data.TryGetValue("sites", out JToken jSites));
            Assert.Equal(JTokenType.Array, jSites.Type);
            var sites = jSites.ToObject<IList<SiteType>>();
            Assert.Equal(0, sites.Count);
        }


        [Fact]
        public void InsertSite_Succeeds()
        {
            var data = contentSchema.ExecuteQueryAndAssert(@"
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
            Assert.True(data.TryGetValue("upsertSite", out JToken jSite));
            Assert.Equal(JTokenType.Object, jSite.Type);
            Assert.True(((JObject)jSite).TryGetValue("id", out JToken jId));
            Assert.Equal(JTokenType.String, jId.Type);
            var siteId = jId.ToObject<string>();
            Assert.NotEmpty(siteId);

            data = contentSchema.ExecuteQueryAndAssert(@"
                query getSites {
                    sites {
                        id,
                        name
                    }
                }
            ");
            Assert.True(data.TryGetValue("sites", out JToken jSites));
            Assert.Equal(JTokenType.Array, jSites.Type);
            var sites = jSites.ToObject<IList<SiteType>>();
            Assert.Equal(1, sites.Count);
            var returnedJSite = jSites.First;
            Assert.True(((JObject)jSite).TryGetValue("id", out JToken returnedJId));
            Assert.Equal(JTokenType.String, returnedJId.Type);
            Assert.Equal(siteId, returnedJId.ToObject<string>());
        }
    }
}
