namespace Stackra.Backend.Models.Users;

public class UserSummaryResponse
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public DateTime CreatedAt { get; set; }
}
