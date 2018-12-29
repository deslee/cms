using System.Linq;
using Content.GraphQL.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Services
{
    public interface IJsonDataResolver
    {
        JObject Resolve(object source);
    }

    public class JsonDataResolver : IJsonDataResolver
    {
        public JObject Resolve(object source)
        {
            var propertiesToMap = source.GetType().GetProperties().Where(property => property.GetCustomAttributes(typeof(MapsToDataAttribute), false).Any());

            var result = JObject.FromObject(propertiesToMap.ToDictionary(p => p.Name, p => p.GetValue(source)));
            return result;
        }
    }
}