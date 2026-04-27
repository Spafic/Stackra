using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Stackra.Backend.Models.Auth;
using Stackra.Backend.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Stackra.Backend.Services;

public class AuthService
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 60000;
    private readonly JwtOptions _jwtOptions;

    public AuthService(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, KeySize);
        return Convert.ToBase64String(Combine(salt, hash));
    }

    public bool TryVerifyPassword(string password, string storedHash, out bool needsUpgrade)
    {
        needsUpgrade = false;

        if (string.IsNullOrWhiteSpace(storedHash))
        {
            return false;
        }

        try
        {
            var bytes = Convert.FromBase64String(storedHash);
            if (bytes.Length != SaltSize + KeySize)
            {
                return false;
            }

            var salt = bytes[..SaltSize];
            var expected = bytes[SaltSize..];
            var actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, KeySize);
            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }
        catch (FormatException)
        {
            // Legacy plaintext password detected; accept once then upgrade to hash.
            needsUpgrade = true;
            return string.Equals(password, storedHash, StringComparison.Ordinal);
        }
    }

    public string GenerateAccessToken(UserRecord user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("token_type", "access")
        };

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken(UserRecord user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("token_type", "refresh"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDays),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool TryValidateRefreshToken(string refreshToken, out int userId)
    {
        userId = 0;
        var tokenHandler = new JwtSecurityTokenHandler();
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = _jwtOptions.Issuer,
            ValidAudience = _jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        try
        {
            var principal = tokenHandler.ValidateToken(refreshToken, parameters, out _);
            var tokenType = principal.FindFirst("token_type")?.Value;
            if (!string.Equals(tokenType, "refresh", StringComparison.Ordinal))
            {
                return false;
            }

            var userIdValue = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdValue, out userId);
        }
        catch
        {
            return false;
        }
    }

    private static byte[] Combine(byte[] salt, byte[] hash)
    {
        var result = new byte[salt.Length + hash.Length];
        Buffer.BlockCopy(salt, 0, result, 0, salt.Length);
        Buffer.BlockCopy(hash, 0, result, salt.Length, hash.Length);
        return result;
    }
}
