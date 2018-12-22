using Content.Data.Models;
using Content.GraphQL.Models.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types.Input
{
    public class PostInputType: InputObjectGraphType<PostInput>
    {
        public PostInputType() {
            Name = "PostInput";
            Field(p => p.Id, nullable: true);
            Field(p => p.Categories, nullable: true);
            Field(s => s.Data, nullable: true);
            Field(p => p.Title);
            Field<ListGraphType<SliceInputType>>("slices", resolve: context => context.Source.Slices);
        }
    }
    
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
            Field(s => s.Data, nullable: true);
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