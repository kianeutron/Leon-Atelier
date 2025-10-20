using AutoMapper;
using MensWear.Api.DTOs;
using MensWear.Api.Models;

namespace MensWear.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId))
            .ForMember(d => d.Created_At, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.Updated_At, o => o.MapFrom(s => s.UpdatedAt));

        CreateMap<Brand, BrandDto>()
            .ForMember(d => d.Created_At, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.Updated_At, o => o.MapFrom(s => s.UpdatedAt));

        CreateMap<Category, CategoryDto>()
            .ForMember(d => d.Created_At, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.Updated_At, o => o.MapFrom(s => s.UpdatedAt));

        CreateMap<Price, PriceDto>()
            .ForMember(d => d.Created_At, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.Updated_At, o => o.MapFrom(s => s.UpdatedAt));

        CreateMap<ProductImage, ProductImageDto>()
            .ForMember(d => d.Created_At, o => o.MapFrom(s => s.CreatedAt));
    }
}
