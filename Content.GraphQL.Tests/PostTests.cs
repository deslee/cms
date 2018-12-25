using System.Collections.Generic;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Newtonsoft.Json.Linq;
using Xunit;
using Content.GraphQL.Tests.Extensions;

namespace Content.GraphQL.Tests
{
    public class PostTests {
        private readonly ContentSchema contentSchema;
        private readonly string siteId;

        public PostTests()
        {
            contentSchema = ContentSchemaFactory.CreateContentSchema();
            var data = contentSchema.ExecuteQueryAndAssert(@"
                mutation createSite($site: SiteInput!) {
                    upsertSite(site: $site) {
                        id
                    }
                }
            ",
            @"{
                ""site"": {
                    ""name"": ""Desmond's Website""
                }
            }");
            Assert.True(data.TryGetValue("upsertSite", out JToken jSite));
            Assert.Equal(JTokenType.Object, jSite.Type);
            Assert.True(((JObject)jSite).TryGetValue("id", out JToken jId));
            Assert.Equal(JTokenType.String, jId.Type);
            siteId = jId.ToObject<string>();
            Assert.NotEmpty(siteId);
        }

        [Fact]
        public void InsertPost_Succeeds() {
            var data = contentSchema.ExecuteQueryAndAssert(@"
                mutation createPost($post: PostInput!, $siteId: String!) {
                    upsertPost(post: $post, siteId: $siteId) {
                        id
                    }
                }
            ",
            @"{
                ""post"": {
                    ""title"": ""Hello world!"",
                    ""categories"": [""Introduction""],
                    ""slices"": [
                        {
                            ""type"": ""PARAGRAPH"",
                            ""content"": ""Hello world!!""
                        },
                        {
                            ""type"": ""VIDEO"",
                            ""autoplay"": true,
                            ""url"": ""https://youtube.com""
                        }
                    ]
                },
                ""siteId"": """ + siteId + @"""
            }");
            
            Assert.True(data.TryGetValue("upsertPost", out JToken jPost));
            Assert.Equal(JTokenType.Object, jPost.Type);
            Assert.True(((JObject)jPost).TryGetValue("id", out JToken jId));
            Assert.Equal(JTokenType.String, jId.Type);
            var postId = jId.ToObject<string>();
            Assert.NotEmpty(postId);

            data = contentSchema.ExecuteQueryAndAssert(@"
                query getSite($siteId: String!) {
                    site(siteId: $siteId) {
                        id
                        categories {
                            name
                            posts {
                                id
                                title
                                slices {
                                    type
                                    ... on ParagraphSlice {
                                        content
                                    }
                                    ... on VideoSlice {
                                        autoplay
                                        url
                                    }
                                }
                            }
                        }
                    }
                }
            ",
            @"{
                ""siteId"": """ + siteId + @"""
            }");
            Assert.True(data.TryGetValue("site", out JToken jSite));
            Assert.Equal(siteId, jSite["id"].ToString());
            Assert.Equal("Introduction", jSite["categories"][0]["name"]);
            Assert.Equal(postId, jSite["categories"][0]["posts"][0]["id"]);
            Assert.Equal("Hello world!", jSite["categories"][0]["posts"][0]["title"]);
            Assert.Equal("PARAGRAPH", jSite["categories"][0]["posts"][0]["slices"][0]["type"]);
            Assert.Equal("Hello world!!", jSite["categories"][0]["posts"][0]["slices"][0]["content"]);
            Assert.Equal("VIDEO", jSite["categories"][0]["posts"][0]["slices"][1]["type"]);
            Assert.Equal(true, jSite["categories"][0]["posts"][0]["slices"][1]["autoplay"]);
            Assert.Equal("https://youtube.com", jSite["categories"][0]["posts"][0]["slices"][1]["url"]);
        }
    }
}