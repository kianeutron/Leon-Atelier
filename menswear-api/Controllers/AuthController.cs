using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MensWear.Api.Data;
using MensWear.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MensWear.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;
    private readonly SymmetricSecurityKey _signingKey;
    private readonly MensWear.Api.Services.IEmailSender? _mailer;

    public AuthController(AppDbContext db, IConfiguration cfg, MensWear.Api.Services.IEmailSender? mailer = null)
    {
        _db = db;
        _cfg = cfg;
        _mailer = mailer;
        var secret = _cfg["AUTH_JWT_SECRET"]
            ?? Environment.GetEnvironmentVariable("AUTH_JWT_SECRET")
            // Default must be >= 32 bytes for HS256
            ?? "dev-secret-change-min-32-bytes-please-1234567890";
        _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }

    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDto dto)
    {
        try
        {
            var email = (dto.Email ?? string.Empty).Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(email)) return BadRequest(new { error = "Missing email" });
            var user = await _db.UsersApp.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null) return Ok(new { ok = true }); // do not reveal existence
            if (user.IsEmailVerified) return Ok(new { ok = true });

            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var verifyToken = Convert.ToHexString(tokenBytes);
            user.EmailVerificationToken = verifyToken;
            await _db.SaveChangesAsync();

            var frontendBase = _cfg["FRONTEND_BASE_URL"]
                ?? Environment.GetEnvironmentVariable("FRONTEND_BASE_URL")
                ?? "http://localhost:3000";
            var verifyUrl = $"{frontendBase}/verify-email?token={verifyToken}";
            var subject = "Verify your email - Léon Atelier";
            var html = $"<p>Hello{(string.IsNullOrWhiteSpace(user.FirstName)?"":" "+user.FirstName)},</p><p>Please verify your email by clicking the link below:</p><p><a href=\"{verifyUrl}\">Verify my email</a></p><p>If the button doesn't work, copy and paste this URL into your browser:<br/>{verifyUrl}</p>";
            try { if (_mailer != null) await _mailer.SendAsync(user.Email, subject, html); } catch { /* ignore */ }
            Console.WriteLine($"[EmailVerification] Resent verify link to {user.Email}: {verifyUrl}");
            return Ok(new { ok = true });
        }
        catch (Exception ex)
        {
            return Problem(title: "Resend verification failed", detail: ex.Message, statusCode: 500);
        }
    }

    [HttpGet("dev/verification-link")]
    public async Task<IActionResult> GetVerificationLink([FromQuery] string email)
    {
        try
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "";
            if (!string.Equals(env, "Development", StringComparison.OrdinalIgnoreCase))
                return NotFound();

            var e = (email ?? string.Empty).Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(e)) return BadRequest(new { error = "Missing email" });
            var user = await _db.UsersApp.AsNoTracking().FirstOrDefaultAsync(u => u.Email == e);
            if (user is null) return NotFound();
            if (user.IsEmailVerified) return Ok(new { verified = true });

            var frontendBase = _cfg["FRONTEND_BASE_URL"]
                ?? Environment.GetEnvironmentVariable("FRONTEND_BASE_URL")
                ?? "http://localhost:3000";
            var verifyUrl = $"{frontendBase}/verify-email?token={user.EmailVerificationToken}";
            return Ok(new { verified = false, url = verifyUrl });
        }
        catch (Exception ex)
        {
            return Problem(title: "Dev link failed", detail: ex.Message, statusCode: 500);
        }
    }

    public record RegisterDto(string Email, string Password, string? FirstName, string? LastName);
    public record LoginDto(string Email, string Password);
    public record VerifyEmailDto(string Token);
    public record ResendVerificationDto(string Email);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Invalid email or password" });

        var email = dto.Email.Trim().ToLowerInvariant();
        try
        {
            var exists = await _db.UsersApp.AsNoTracking().AnyAsync(u => u.Email == email);
            if (exists) return Conflict(new { error = "Email already registered" });

            var (saltHex, hashHex, iterations) = HashPassword(dto.Password);
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var verifyToken = Convert.ToHexString(tokenBytes);

            var user = new UserApp
            {
                Email = email,
                PasswordHash = $"{saltHex}:{hashHex}:{iterations}",
                FirstName = string.IsNullOrWhiteSpace(dto.FirstName) ? null : dto.FirstName,
                LastName = string.IsNullOrWhiteSpace(dto.LastName) ? null : dto.LastName,
                CreatedAt = DateTime.UtcNow,
                IsEmailVerified = false,
                EmailVerificationToken = verifyToken,
            };
            _db.UsersApp.Add(user);
            await _db.SaveChangesAsync();

            // Simulate email by logging the verification URL
            var frontendBase = _cfg["FRONTEND_BASE_URL"]
                ?? Environment.GetEnvironmentVariable("FRONTEND_BASE_URL")
                ?? "http://localhost:3000";
            var verifyUrl = $"{frontendBase}/verify-email?token={verifyToken}";
            var subject = "Verify your email - Léon Atelier";
            var html = $"<p>Hello{(string.IsNullOrWhiteSpace(user.FirstName)?"":" "+user.FirstName)},</p><p>Thanks for creating an account at Léon Atelier. Please verify your email by clicking the link below:</p><p><a href=\"{verifyUrl}\">Verify my email</a></p><p>If the button doesn't work, copy and paste this URL into your browser:<br/>{verifyUrl}</p>";
            try { if (_mailer != null) await _mailer.SendAsync(user.Email, subject, html); } catch { /* swallow to not leak mail errors */ }
            Console.WriteLine($"[EmailVerification] Send verify link to {user.Email}: {verifyUrl}");

            // Do not auto sign-in; ask user to verify email
            return Ok(new { ok = true, user = new { id = user.Id, email = user.Email, firstName = user.FirstName, lastName = user.LastName }, needsVerification = true });
        }
        catch (Npgsql.PostgresException pgx) when (pgx.SqlState == "23505")
        {
            // unique_violation
            return Conflict(new { error = "Email already registered" });
        }
        catch (Exception ex)
        {
            // Surface message to help diagnose (e.g., RLS violation)
            return Problem(title: "Register failed", detail: ex.Message, statusCode: 500);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var email = (dto.Email ?? string.Empty).Trim().ToLowerInvariant();
            var user = await _db.UsersApp.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
            if (user is null) return Unauthorized(new { error = "Invalid credentials" });

            var parts = (user.PasswordHash ?? string.Empty).Split(':');
            if (parts.Length < 3) return Unauthorized(new { error = "Invalid credentials" });
            if (!VerifyPassword(dto.Password ?? string.Empty, parts[0], parts[1], int.Parse(parts[2])))
                return Unauthorized(new { error = "Invalid credentials" });

            if (!(user.IsEmailVerified))
                return StatusCode(403, new { error = "Email not verified. Please check your inbox for the verification link." });

            var token = CreateJwt(user.Id, user.Email);
            return Ok(new { ok = true, token, user = new { id = user.Id, email = user.Email, firstName = user.FirstName, lastName = user.LastName } });
        }
        catch (Exception ex)
        {
            return Problem(title: "Login failed", detail: ex.Message, statusCode: 500);
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(sub, out var id)) return Unauthorized();
        var user = await _db.UsersApp.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return Unauthorized();
        return Ok(new { user = new { id = user.Id, email = user.Email, firstName = user.FirstName, lastName = user.LastName, createdAt = user.CreatedAt } });
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
    {
        try
        {
            var token = dto.Token;
            if (string.IsNullOrWhiteSpace(token)) return BadRequest(new { error = "Missing token" });
            var user = await _db.UsersApp.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
            if (user is null) return BadRequest(new { error = "Invalid or expired token" });
            user.IsEmailVerified = true;
            user.EmailVerifiedAt = DateTime.UtcNow;
            user.EmailVerificationToken = null;
            await _db.SaveChangesAsync();
            return Ok(new { ok = true });
        }
        catch (Exception ex)
        {
            return Problem(title: "Verify email failed", detail: ex.Message, statusCode: 500);
        }
    }

    private static (string saltHex, string hashHex, int iterations) HashPassword(string password, int iterations = 200_000)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);
        return (Convert.ToHexString(salt), Convert.ToHexString(hash), iterations);
    }

    private static bool VerifyPassword(string password, string saltHex, string hashHex, int iterations)
    {
        var salt = Convert.FromHexString(saltHex);
        var expected = Convert.FromHexString(hashHex);
        var actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);
        return CryptographicOperations.FixedTimeEquals(actual, expected);
    }

    private string CreateJwt(long userId, string email)
    {
        var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email)
        };
        var token = new JwtSecurityToken(
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
