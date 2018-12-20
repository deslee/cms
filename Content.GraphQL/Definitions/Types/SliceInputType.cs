using System.Collections.Generic;
using Content.Data.Models;
using Content.GraphQL.Models;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{

    public class SliceInputType : InputObjectGraphType<SliceInput>
    {
        public SliceInputType()
        {
            Name = "SliceInput";
            Field(s => s.Id, nullable: true);
            Field(s => s.Type, type: typeof(SliceTypeEnum));
            Field(s => s.Text, nullable: true);
            Field(s => s.Autoplay, nullable: true);
            Field(s => s.Loop, nullable: true);
            Field(s => s.Url, nullable: true);
            Field(s => s.Assets, nullable: true);
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