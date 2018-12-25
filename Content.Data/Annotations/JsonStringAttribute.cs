using System;

namespace Content.Data.Annotations {
    //
    // Summary:
    //     Denotes that a property or class should be excluded from database mapping.
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class JsonStringAttribute : Attribute {
        public JsonStringAttribute() {
            
        }
    }
}