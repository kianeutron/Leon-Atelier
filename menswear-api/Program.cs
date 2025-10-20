using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;
using Microsoft.OData.Edm;
using MensWear.Api.Data;
using MensWear.Api.Models;
using MensWear.Api.DTOs;
using MensWear.Api.Profiles;
using Serilog;
using MensWear.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Default")
    ?? Environment.GetEnvironmentVariable("ConnectionStrings__Default")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? string.Empty;

builder.Services.AddDbContext<AppDbContext>(options =>
    options
        .UseNpgsql(connString, npgsql =>
        {
            npgsql.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(2),
                errorCodesToAdd: null
            );
        })
        .UseSnakeCaseNamingConvention()
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging());

var frontendOrigin = builder.Configuration["FRONTEND_ORIGIN"]
    ?? Environment.GetEnvironmentVariable("FRONTEND_ORIGIN");
var allowVercelPreviews = (builder.Configuration["ALLOW_VERCEL_PREVIEWS"]
    ?? Environment.GetEnvironmentVariable("ALLOW_VERCEL_PREVIEWS")
    ?? "0") == "1";

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        // Allow exact configured origin(s) plus localhost, and optionally any *.vercel.app preview
        policy.SetIsOriginAllowed(origin =>
        {
            try
            {
                if (string.IsNullOrWhiteSpace(origin)) return false;
                if (origin.StartsWith("http://localhost:")) return true;
                if (origin.Equals("https://localhost:3000", StringComparison.OrdinalIgnoreCase)) return true;
                // Allow Capacitor/Ionic Android WebView origins
                if (origin.StartsWith("capacitor://", StringComparison.OrdinalIgnoreCase)) return true;
                if (origin.StartsWith("ionic://", StringComparison.OrdinalIgnoreCase)) return true;

                if (!string.IsNullOrWhiteSpace(frontendOrigin) &&
                    origin.Equals(frontendOrigin, StringComparison.OrdinalIgnoreCase)) return true;

                if (allowVercelPreviews)
                {
                    if (Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                    {
                        var host = uri.Host;
                        if (host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
                    }
                }
            }
            catch { }
            return false;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.Services.AddControllers().AddOData(opt =>
{
    opt.Select().Filter().OrderBy().Expand().Count().SetMaxTop(100)
       .AddRouteComponents("odata", GetEdmModel());
});

builder.Services.AddEndpointsApiExplorer();

// Email sender service (SMTP)
var smtpHost = builder.Configuration["SMTP__HOST"] ?? Environment.GetEnvironmentVariable("SMTP__HOST");
var smtpPortStr = builder.Configuration["SMTP__PORT"] ?? Environment.GetEnvironmentVariable("SMTP__PORT") ?? "0";
var smtpFrom = builder.Configuration["SMTP__FROM"] ?? Environment.GetEnvironmentVariable("SMTP__FROM");
var smtpUser = builder.Configuration["SMTP__USER"] ?? Environment.GetEnvironmentVariable("SMTP__USER");
var smtpPass = builder.Configuration["SMTP__PASS"] ?? Environment.GetEnvironmentVariable("SMTP__PASS");
var smtpSslStr = builder.Configuration["SMTP__SSL"] ?? Environment.GetEnvironmentVariable("SMTP__SSL") ?? "true";
int.TryParse(smtpPortStr, out var smtpPort);
bool.TryParse(smtpSslStr, out var smtpSsl);
if (!string.IsNullOrWhiteSpace(smtpHost) && !string.IsNullOrWhiteSpace(smtpFrom) && smtpPort > 0)
{
    builder.Services.AddSingleton<IEmailSender>(new SmtpEmailSender(smtpHost!, smtpPort, smtpFrom!, smtpUser, smtpPass, smtpSsl));
}

// JWT authentication
// Must match the default used when signing tokens in AuthController
var jwtSecret = builder.Configuration["AUTH_JWT_SECRET"]
    ?? Environment.GetEnvironmentVariable("AUTH_JWT_SECRET")
    ?? "dev-secret-change-min-32-bytes-please-1234567890";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });
builder.Services.AddAuthorization();

// Prefer Render's PORT if available; else ASPNETCORE_URLS; else localhost
var renderPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(renderPort))
{
    builder.WebHost.UseUrls($"http://+:{renderPort}");
}
else
{
    builder.WebHost.UseUrls(Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://localhost:5252");
}

// Serilog simple console
builder.Host.UseSerilog((ctx, lc) => lc
    .MinimumLevel.Debug()
    .WriteTo.Console());

var app = builder.Build();

// Honor X-Forwarded-* from Render so Request.Scheme/Host are correct (https)
var fwdOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
};
// In Render, we don't know proxy addresses; allow all networks/proxies
fwdOptions.KnownNetworks.Clear();
fwdOptions.KnownProxies.Clear();
app.UseForwardedHeaders(fwdOptions);

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Optionally run a lightweight schema patch at startup (disable by default for hosted DBs)
var runStartupSql = (Environment.GetEnvironmentVariable("ENABLE_STARTUP_SQL") ?? "0") == "1";
if (runStartupSql)
{
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var sql = @"
                ALTER TABLE IF EXISTS users_app
                  ADD COLUMN IF NOT EXISTS is_email_verified boolean NOT NULL DEFAULT false,
                  ADD COLUMN IF NOT EXISTS email_verification_token text NULL,
                  ADD COLUMN IF NOT EXISTS email_verified_at timestamp with time zone NULL;";
            await db.Database.ExecuteSqlRawAsync(sql);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Startup] Failed to ensure verification columns: {ex.Message}");
        }
    }
}

// Health/debug endpoints
app.MapGet("/debug/ping", async (MensWear.Api.Data.AppDbContext db) =>
{
    try
    {
        var canConnect = await db.Database.CanConnectAsync();
        int? count = null;
        if (canConnect)
        {
            try { count = await db.Products.CountAsync(); } catch { /* ignore */ }
        }
        return Results.Ok(new { canConnect, products = count });
    }
    catch (Exception ex)
    {
        // Never 500 here; just report connectivity failure
        return Results.Ok(new { canConnect = false, error = ex.Message });
    }
});

app.Run();

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EntitySet<ProductDto>("Products");
    builder.EntitySet<BrandDto>("Brands");
    builder.EntitySet<CategoryDto>("Categories");
    builder.EntitySet<PriceDto>("Prices");
    builder.EntitySet<ProductImageDto>("ProductImages");
    return builder.GetEdmModel();
}
