using System;
using System.Linq;
using AutoMapper;
using Content.Data.Models;
using Content.GraphQL.Models.Input;

namespace Content.GraphQL.MapperProfiles
{
    public class ContentMapperProfile : Profile
    {
        public ContentMapperProfile()
        {
            CreateMap<SiteInput, Site>();
            CreateMap<PostInput, Post>()
                .ForMember(d => d.PostCategories, o => o.MapFrom((src, dest, res, ctx) => src.Categories.Select(cat => new PostCategory {
                    Post = dest,
                    PostId = dest.Id,
                    Category = new Category {
                        Name = cat
                    }
                })))
                .ForMember(p => p.Slices, opt => opt.MapFrom((src, dest, res, ctx) => src.Slices.Select<SliceInput, Slice>(s =>
                {
                    if (s.Type == "paragraph")
                    {
                        return ctx.Mapper.Map<ParagraphSlice>(s);
                    }
                    else if (s.Type == "images")
                    {
                        return ctx.Mapper.Map<ImagesSlice>(s);
                    }
                    else if (s.Type == "video")
                    {
                        return ctx.Mapper.Map<VideoSlice>(s);
                    }
                    else
                    {
                        return null;
                    }
                }).ToList()));

            CreateMap<SliceInput, ParagraphSlice>();
            CreateMap<SliceInput, ImagesSlice>()
                .ForMember(d => d.AssetSlices, o => o.MapFrom(s => s.Assets.Select(assetId => new AssetSlice
                {
                    AssetId = assetId,
                    SliceId = s.Id
                })));
            CreateMap<SliceInput, VideoSlice>();
        }
    }
}