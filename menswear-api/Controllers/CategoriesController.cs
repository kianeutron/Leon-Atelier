using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MensWear.Api.Data;
using MensWear.Api.DTOs;

namespace MensWear.Api.Controllers;

public class CategoriesController : ODataController
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public CategoriesController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [EnableQuery]
    [HttpGet]
    public IActionResult Get()
    {
        try { return Ok(QueryCategories()); }
        catch (Exception ex) { return Problem(title: "Get categories failed", detail: ex.Message, statusCode: 500); }
    }

    private IQueryable<CategoryDto> QueryCategories()
    {
        return _db.Categories.AsNoTracking().ProjectTo<CategoryDto>(_mapper.ConfigurationProvider);
    }
}
