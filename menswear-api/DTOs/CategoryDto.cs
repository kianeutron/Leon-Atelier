using System.ComponentModel.DataAnnotations;

namespace MensWear.Api.DTOs;

public class CategoryDto
{
    [Key]
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentId { get; set; }
    public DateTimeOffset Created_At { get; set; }
    public DateTimeOffset Updated_At { get; set; }
}
