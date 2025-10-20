using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MensWear.Api.Data;
using MensWear.Api.DTOs;

namespace MensWear.Api.Controllers;

public class ProductImagesController : ODataController
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ProductImagesController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<ProductImageDto> Get()
    {
        return _db.ProductImages.AsNoTracking().ProjectTo<ProductImageDto>(_mapper.ConfigurationProvider);
    }
}
