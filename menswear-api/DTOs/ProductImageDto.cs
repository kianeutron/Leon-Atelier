using System.ComponentModel.DataAnnotations;

namespace MensWear.Api.DTOs;

public class ProductImageDto
{
    [Key]
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public string? Url { get; set; }
    public string? StorageBucket { get; set; }
    public string? StoragePath { get; set; }
    public string? Alt { get; set; }
    public int Position { get; set; }
    public DateTimeOffset Created_At { get; set; }
}
