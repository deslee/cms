using System;
using System.Linq;
using System.Collections.Generic;
using Content.GraphQL.Definitions;
using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Content.GraphQL.Tests.Extensions {
    public static class ContentSchemaExtensions {
        public static JObject ExecuteQueryAndAssert(this ContentSchema schema, string query, string inputs = null)
        {
            var json = schema.Execute(_ =>
            {
                _.Query = query;
                _.Inputs = inputs != null ? new Inputs((IDictionary<string, object>)ConvertToDictionary(JsonConvert.DeserializeObject<JObject>(inputs))) : null;
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

        private static object ConvertToDictionary(JToken token) {
            switch(token.Type) {
                case JTokenType.String:
                    return token.ToObject<string>();
                case JTokenType.Boolean:
                    return token.ToObject<bool>();
                case JTokenType.Integer:
                    return token.ToObject<int>();
                case JTokenType.Float:
                    return token.ToObject<float>();
                case JTokenType.Date:
                    return token.ToObject<DateTime>();
                case JTokenType.Object:
                    return ((JObject)token).Properties().ToDictionary(prop => prop.Name, prop => ConvertToDictionary(prop.Value));
                case JTokenType.Array:
                    return ((JArray)token).Select(t => ConvertToDictionary(t));
                default:
                    return null;
            }
        }
    }
}