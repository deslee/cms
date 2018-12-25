using Content.Data.Models;
using Content.GraphQL.Definitions.Types.Input;
using Content.GraphQL.Models;
using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Definitions.Types
{
    public class SliceType : InterfaceGraphType<Slice>
    {
        public SliceType()
        {
            Name = "Slice";
            Field<SliceTypeEnum>(
                name: "type", 
                resolve: context => context.Source.Type.ToUpper()
            );
        }
    }

    public class ParagraphSliceType : ObjectGraphType<ParagraphSlice>
    {
        public ParagraphSliceType()
        {
            Name = "ParagraphSlice";
            Interface<SliceType>();

            Field<SliceTypeEnum>(
                name: "type", 
                resolve: context => context.Source.Type.ToUpper()
            );
            Field<StringGraphType>(
                name: "content",
                resolve: context => context.Source.Content
            );
        }
    }

    public class VideoSliceType : ObjectGraphType<VideoSlice>
    {
        public VideoSliceType()
        {
            Name = "VideoSlice";
            Interface<SliceType>();

            Field<SliceTypeEnum>(
                name: "type", 
                resolve: context => context.Source.Type.ToUpper()
            );
            Field(p => p.Url);
            Field(p => p.Autoplay);
            Field(p => p.Loop);
        }
    }

    public class ImagesSliceType : ObjectGraphType<ImagesSlice>
    {
        public ImagesSliceType() {
            Name = "ImagesSlice";
            Interface<SliceType>();

            Field<SliceTypeEnum>(
                name: "type", 
                resolve: context => context.Source.Type.ToUpper()
            );
            Field<ListGraphType<StringGraphType>>(
                name: "images",
                resolve: context => context.Source.Images
            );
        }
    }
}