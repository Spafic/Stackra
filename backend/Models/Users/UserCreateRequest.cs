namespace Stackra.Backend.Models.Users;

public class UserCreateRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public decimal? AvgSpending { get; set; }
    public string? Portfolio { get; set; }
}
