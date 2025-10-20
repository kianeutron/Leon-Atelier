using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MensWear.Api.Models;

[Table("product_images")]
public class ProductImage
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("product_id")]
    public Guid ProductId { get; set; }

    [Column("variant_id")]
    public Guid? VariantId { get; set; }

    [Column("url")]
    public string? Url { get; set; }

    [Column("storage_bucket")]
    public string? StorageBucket { get; set; }

    [Column("storage_path")]
    public string? StoragePath { get; set; }

    [Column("alt")]
    public string? Alt { get; set; }

    [Column("position")]
    public int Position { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }
}
