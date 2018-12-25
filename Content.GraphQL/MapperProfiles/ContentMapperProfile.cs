using System;
using System.Linq;
using AutoMapper;
using Content.Data.Models;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Input;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.MapperProfiles
{
    public class ContentMapperProfile : Profile
    {
        public ContentMapperProfile()
        {
            CreateMap<SiteInput, Site>();
            CreateMap<PostInput, Post>()
                .ForMember(d => d.PostGroups, o => o.MapFrom((src, dest, res, ctx) => src.Categories.Select(groupName => new PostGroup {
                    Post = dest,
                    PostId = dest.Id,
                    Group = new Group {
                        Name = groupName
                    }
                })))
                .ForMember(p => p.Data, opt => opt.MapFrom((src, dest, res, ctx) => {
                    return JObject.FromObject(new {
                        Title = src.Title,
                        Slices = src.Slices
                    });
                }));

            CreateMap<SliceInput, ParagraphSlice>();
            CreateMap<SliceInput, ImagesSlice>();
            CreateMap<SliceInput, VideoSlice>();
        }
    }
}