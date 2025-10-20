using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MensWear.Api.Models;

[Table("prices")]
public class Price
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("product_id")]
    public Guid? ProductId { get; set; }

    [Column("variant_id")]
    public Guid? VariantId { get; set; }

    [Column("currency_code")]
    public string CurrencyCode { get; set; } = "USD";

    [Column("amount_cents")]
    public int AmountCents { get; set; }

    [Column("compare_at_cents")]
    public int? CompareAtCents { get; set; }

    [Column("starts_at")]
    public DateTimeOffset? StartsAt { get; set; }

    [Column("ends_at")]
    public DateTimeOffset? EndsAt { get; set; }

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }
}
