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
    public IActionResult Get()
    {
        try { return Ok(QueryProducts()); }
        catch (Exception ex) { return Problem(title: "Get products failed", detail: ex.Message, statusCode: 500); }
    }

    private IQueryable<ProductDto> QueryProducts()
    {
        return _db.Products.AsNoTracking().ProjectTo<ProductDto>(_mapper.ConfigurationProvider);
    }
}
