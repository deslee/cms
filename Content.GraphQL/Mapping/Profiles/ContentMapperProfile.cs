using System;
using System.Linq;
using AutoMapper;
using Content.Data.Models;
using Content.GraphQL.Mapping.Resolvers;
using Content.GraphQL.Models;
using Content.GraphQL.Models.Input;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Mapping.Profiles
{
    public class ContentMapperProfile : Profile
    {
        public ContentMapperProfile()
        {
            CreateMap<SiteInput, Site>();
            CreateMap<PostInput, Item>()
                .ForMember(d => d.ItemGroups, o => o.MapFrom((src, dest, res, ctx) => src.Categories?.Select(groupName => new ItemGroup {
                    Item = dest,
                    ItemId = dest.Id,
                    Group = new Group {
                        Name = groupName
                    }
                })))
                .ForMember(p => p.Data, o => o.MapFrom<JsonDataResolver>())
                .ForMember(p => p.Type, o => o.MapFrom(s => "post"));
                
            CreateMap<RegisterInput, User>()
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email.ToLower()))
                .ForMember(d => d.Data, o => o.MapFrom<JsonDataResolver>());

            CreateMap<SliceInput, ParagraphSlice>();
            CreateMap<SliceInput, ImagesSlice>();
            CreateMap<SliceInput, VideoSlice>();
        }
    }
}