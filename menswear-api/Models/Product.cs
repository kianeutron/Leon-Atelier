using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace MensWear.Api.Models;

[Table("products")]
public class Product
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("slug")]
    public string Slug { get; set; } = string.Empty;

    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("subtitle")]
    public string? Subtitle { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("brand_id")]
    public Guid? BrandId { get; set; }

    [Column("category_id")]
    public Guid? CategoryId { get; set; }

    [Column("collection_id")]
    public Guid? CollectionId { get; set; }

    [Column("active")]
    public bool Active { get; set; }

    [Column("metadata")]
    public JsonDocument Metadata { get; set; } = JsonDocument.Parse("{}");

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }
}
