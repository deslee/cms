using System;

namespace Content.GraphQL.Annotations
{
    public class MapsToDataAttribute : Attribute
    {
        public string Key { get; internal set; }

        public MapsToDataAttribute(string key)
        {
            Key = key;
        }
    }
}