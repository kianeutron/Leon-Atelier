using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MensWear.Api.Data;
using MensWear.Api.DTOs;

namespace MensWear.Api.Controllers;

public class BrandsController : ODataController
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public BrandsController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<BrandDto> Get()
    {
        return _db.Brands.AsNoTracking().ProjectTo<BrandDto>(_mapper.ConfigurationProvider);
    }
}
