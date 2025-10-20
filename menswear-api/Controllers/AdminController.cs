using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MensWear.Api.Data;
using System.Text.RegularExpressions;

namespace MensWear.Api.Controllers;

[ApiController]
[Route("admin")] 
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db) { _db = db; }

    public record FixResult(int Updated, int Total);

    [HttpPost("fix-product-categories")]
    public async Task<ActionResult<FixResult>> FixProductCategories()
    {
        var cats = await _db.Categories.AsNoTracking().ToListAsync();
        Guid? idTops = cats.FirstOrDefault(c => c.Slug == "tops")?.Id;
        Guid? idBottoms = cats.FirstOrDefault(c => c.Slug == "bottoms")?.Id;
        Guid? idOuterwear = cats.FirstOrDefault(c => c.Slug == "outerwear")?.Id;
        Guid? idKnitwear = cats.FirstOrDefault(c => c.Slug == "knitwear")?.Id;
        Guid? idFootwear = cats.FirstOrDefault(c => c.Slug == "footwear")?.Id;

        int updated = 0;
        var prods = await _db.Products.ToListAsync();
        foreach (var p in prods)
        {
            var text = ($"{p.Title} {p.Subtitle} {p.Description}").ToLowerInvariant();

            Guid? target = null;
            if (Regex.IsMatch(text, @"\b(loafers?|oxfords?|derbys?|boots?|sneakers?)\b"))
                target = idFootwear ?? target;
            if (Regex.IsMatch(text, @"\b(trousers?|jeans|denim\b.*(pants|trousers)|chinos?|pants)\b"))
                target = idBottoms ?? target;
            if (Regex.IsMatch(text, @"\b(knit|sweater|cardigan|merino|cashmere)\b"))
                target = idKnitwear ?? target;
            if (Regex.IsMatch(text, @"\b(coat|trench|jacket|blazer|parka|overcoat|raincoat|windbreaker|overshirt)\b"))
                target = idOuterwear ?? target;
            if (target == null && Regex.IsMatch(text, @"\b(shirt|tee|t[- ]?shirt|polo|henley|overshirt)\b"))
                target = idTops ?? target;

            if (target != null && p.CategoryId != target)
            {
                p.CategoryId = target;
                updated++;
            }
        }
        await _db.SaveChangesAsync();
        return Ok(new FixResult(updated, prods.Count));
    }
}
