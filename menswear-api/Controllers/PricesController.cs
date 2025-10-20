using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MensWear.Api.Data;
using MensWear.Api.DTOs;

namespace MensWear.Api.Controllers;

public class PricesController : ODataController
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public PricesController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<PriceDto> Get()
    {
        return _db.Prices.AsNoTracking().ProjectTo<PriceDto>(_mapper.ConfigurationProvider);
    }
}
