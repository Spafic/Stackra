namespace Stackra.Backend.Options;

public class JwtOptions
{
    public string Issuer { get; set; } = "Stackra";
    public string Audience { get; set; } = "Stackra";
    public string SecretKey { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 7;
}
