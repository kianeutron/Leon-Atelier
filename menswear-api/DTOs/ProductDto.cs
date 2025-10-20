using System.ComponentModel.DataAnnotations;

namespace MensWear.Api.DTOs;

public class ProductDto
{
    [Key]
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public bool Active { get; set; }
    public DateTimeOffset Created_At { get; set; }
    public DateTimeOffset Updated_At { get; set; }
}
