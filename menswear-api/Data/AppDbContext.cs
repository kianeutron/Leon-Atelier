using Microsoft.EntityFrameworkCore;
using MensWear.Api.Models;

namespace MensWear.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Price> Prices => Set<Price>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<UserApp> UsersApp => Set<UserApp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>().ToTable("products");
        modelBuilder.Entity<Brand>().ToTable("brands");
        modelBuilder.Entity<Category>().ToTable("categories");
        modelBuilder.Entity<Price>().ToTable("prices");
        modelBuilder.Entity<ProductImage>().ToTable("product_images");
        modelBuilder.Entity<UserApp>().ToTable("users_app");
        modelBuilder.HasPostgresExtension("pgcrypto");
    }
}
