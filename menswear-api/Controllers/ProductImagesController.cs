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
    public IActionResult Get()
    {
        try { return Ok(QueryProductImages()); }
        catch (Exception ex) { return Problem(title: "Get product images failed", detail: ex.Message, statusCode: 500); }
    }

    private IQueryable<ProductImageDto> QueryProductImages()
    {
        return _db.ProductImages.AsNoTracking().ProjectTo<ProductImageDto>(_mapper.ConfigurationProvider);
    }
}
