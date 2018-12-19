using System.Collections.Generic;
using Content.Data.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{

    public class SliceInputType : InputObjectGraphType
    {
        public SliceInputType()
        {
            Name = "SliceInput";
            Field<StringGraphType>("id");
            Field<SliceTypeEnum>("type");
            Field<StringGraphType>("text");
            Field<BooleanGraphType>("autoplay");
            Field<BooleanGraphType>("loop");
            Field<StringGraphType>("url");
            Field<ListGraphType<StringGraphType>>("assets");
        }
    }
    public class SliceTypeEnum: EnumerationGraphType {
        public SliceTypeEnum() {
            Name = "SliceType";
            AddValue("PARAGRAPH", "A paragraph", "paragraph");
            AddValue("IMAGES", "A set of images", "images");
            AddValue("VIDEO", "A video", "video");
        }
    }
}