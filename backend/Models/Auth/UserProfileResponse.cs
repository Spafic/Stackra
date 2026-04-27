namespace Stackra.Backend.Models.Auth;

public class UserProfileResponse
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public decimal? AvgSpending { get; set; }
    public string? Portfolio { get; set; }
}
