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
        try
        {
            var ids = await LoadCategoryIdsAsync();
            var (updated, total) = await ReclassifyProductsAsync(ids);
            return Ok(new FixResult(updated, total));
        }
        catch (Exception ex)
        {
            return Problem(title: "Fix categories failed", detail: ex.Message, statusCode: 500);
        }
    }

    private async Task<(Guid? tops, Guid? bottoms, Guid? outerwear, Guid? knitwear, Guid? footwear)> LoadCategoryIdsAsync()
    {
        var cats = await _db.Categories.AsNoTracking().ToListAsync();
        return (
            cats.FirstOrDefault(c => c.Slug == "tops")?.Id,
            cats.FirstOrDefault(c => c.Slug == "bottoms")?.Id,
            cats.FirstOrDefault(c => c.Slug == "outerwear")?.Id,
            cats.FirstOrDefault(c => c.Slug == "knitwear")?.Id,
            cats.FirstOrDefault(c => c.Slug == "footwear")?.Id
        );
    }

    private async Task<(int updated, int total)> ReclassifyProductsAsync((Guid? tops, Guid? bottoms, Guid? outerwear, Guid? knitwear, Guid? footwear) ids)
    {
        int updated = 0;
        var prods = await _db.Products.ToListAsync();
        foreach (var p in prods)
        {
            var target = InferCategory(p, ids);
            if (target != null && p.CategoryId != target)
            {
                p.CategoryId = target;
                updated++;
            }
        }
        await _db.SaveChangesAsync();
        return (updated, prods.Count);
    }

    private static Guid? InferCategory(Models.Product p, (Guid? tops, Guid? bottoms, Guid? outerwear, Guid? knitwear, Guid? footwear) ids)
    {
        var text = ($"{p.Title} {p.Subtitle} {p.Description}").ToLowerInvariant();
        Guid? target = null;
        if (Regex.IsMatch(text, @"\b(loafers?|oxfords?|derbys?|boots?|sneakers?)\b")) target = ids.footwear ?? target;
        if (Regex.IsMatch(text, @"\b(trousers?|jeans|denim\b.*(pants|trousers)|chinos?|pants)\b")) target = ids.bottoms ?? target;
        if (Regex.IsMatch(text, @"\b(knit|sweater|cardigan|merino|cashmere)\b")) target = ids.knitwear ?? target;
        if (Regex.IsMatch(text, @"\b(coat|trench|jacket|blazer|parka|overcoat|raincoat|windbreaker|overshirt)\b")) target = ids.outerwear ?? target;
        if (target == null && Regex.IsMatch(text, @"\b(shirt|tee|t[- ]?shirt|polo|henley|overshirt)\b")) target = ids.tops ?? target;
        return target;
    }
}
