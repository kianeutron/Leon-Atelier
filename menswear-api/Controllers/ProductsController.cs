using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using MensWear.Api.Data;
using MensWear.Api.Models;
using MensWear.Api.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace MensWear.Api.Controllers;

public class ProductsController : ODataController
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ProductsController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<ProductDto> Get()
    {
        return _db.Products
            .AsNoTracking()
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider);
    }
}
