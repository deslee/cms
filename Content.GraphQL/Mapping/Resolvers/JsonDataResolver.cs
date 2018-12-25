using System.Linq;
using AutoMapper;
using Content.GraphQL.Annotations;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Mapping.Resolvers {
    public class JsonDataResolver : IValueResolver<object, object, JObject>
    {
        public JObject Resolve(object source, object destination, JObject destMember, ResolutionContext context)
        {
            var propertiesToMap = source.GetType().GetProperties().Where(property => property.GetCustomAttributes(typeof(MapsToDataAttribute), false).Any());

            var result = JObject.FromObject(propertiesToMap.ToDictionary(p => p.Name, p => p.GetValue(source)));
            return result;
        }
    }
}