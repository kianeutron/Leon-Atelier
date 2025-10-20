using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MensWear.Api.Data;

namespace MensWear.Api.Controllers;

[ApiController]
[Route("debug")] 
public class DebugController : ControllerBase
{
    private readonly AppDbContext _db;
    public DebugController(AppDbContext db) { _db = db; }

    [HttpGet("products")] 
    public async Task<IActionResult> GetProducts()
    {
        var items = await _db.Products.AsNoTracking().OrderByDescending(p => p.CreatedAt).Take(10).ToListAsync();
        return Ok(items);
    }
}
