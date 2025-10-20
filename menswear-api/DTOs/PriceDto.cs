using System.ComponentModel.DataAnnotations;

namespace MensWear.Api.DTOs;

public class PriceDto
{
    [Key]
    public Guid Id { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public string CurrencyCode { get; set; } = "USD";
    public int AmountCents { get; set; }
    public int? CompareAtCents { get; set; }
    public DateTimeOffset? StartsAt { get; set; }
    public DateTimeOffset? EndsAt { get; set; }
    public DateTimeOffset Created_At { get; set; }
    public DateTimeOffset Updated_At { get; set; }
}
