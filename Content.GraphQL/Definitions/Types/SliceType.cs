using Content.Data.Models;
using Content.GraphQL.Definitions.Types.Input;
using GraphQL;
using GraphQL.Types;

namespace Content.GraphQL.Definitions.Types
{
    public class SliceType : InterfaceGraphType<Slice>
    {
        public SliceType()
        {
            Name = "Slice";
            Field(s => s.Id);
            Field<SliceTypeEnum>("type", resolve: context => context.Source.Type.ToUpper());
        }
    }

    public class ParagraphSliceType : ObjectGraphType<ParagraphSlice>
    {
        public ParagraphSliceType()
        {
            Name = "ParagraphSlice";
            Field(s => s.Id);
            Field<SliceTypeEnum>("type", resolve: context => context.Source.Type.ToUpper());
            Field(p => p.Text);
            Interface<SliceType>();
        }
    }

    public class VideoSliceType : ObjectGraphType<VideoSlice>
    {
        public VideoSliceType()
        {
            Name = "VideoSlice";
            Field(s => s.Id);
            Field<SliceTypeEnum>("type", resolve: context => context.Source.Type.ToUpper());
            Field(p => p.Url);
            Field(p => p.Autoplay);
            Field(p => p.Loop);
            Interface<SliceType>();
        }
    }

    public class ImagesSliceType : ObjectGraphType<ImagesSlice>
    {
        public ImagesSliceType() {
            Name = "ImagesSlice";
            Field(s => s.Id);
            Field<SliceTypeEnum>("type", resolve: context => context.Source.Type.ToUpper());
            Interface<SliceType>();
        }
    }
}