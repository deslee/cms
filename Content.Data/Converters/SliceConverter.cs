using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Content.Data.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.Data.Converters {
    public class SliceConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(Slice));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);
            var objType = obj["type"].Value<string>();
            Slice slice;
            if (objType == "paragraph") {
                slice = new ParagraphSlice();
            } else if (objType == "video") {
                slice = new VideoSlice();
            } else if (objType == "image") {
                slice = new ImagesSlice();
            } else {
                throw new Exception("Invalid type " + objType);
            }
            serializer.Populate(obj.CreateReader(), slice);
            return slice;
        }

        public override bool CanWrite => false;

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}