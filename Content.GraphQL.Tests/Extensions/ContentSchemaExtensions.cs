using System.Collections.Generic;
using Content.GraphQL.Definitions;
using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Content.GraphQL.Tests.Extensions {
    public static class ContentSchemaExtensions {
        public static JObject ExecuteQueryAndAssert(this ContentSchema schema, string query, IDictionary<string, object> inputs = null)
        {
            var json = schema.Execute(_ =>
            {
                _.Query = query;
                _.Inputs = inputs != null ? new Inputs(inputs) : null;
            });
            var response = JsonConvert.DeserializeObject<JObject>(json);
            var hasErrors = response.TryGetValue("errors", out var errors);
            if (hasErrors == true)
            {
                Assert.False(hasErrors, $"Errors found: {errors.ToString()}");
            }
            Assert.Equal(JTokenType.Object, response.Type);
            Assert.True(response.TryGetValue("data", out JToken data));
            Assert.Equal(JTokenType.Object, data.Type);
            return data.ToObject<JObject>();
        }
    }
}