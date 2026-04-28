namespace Stackra.Backend.Models.Users;

public class RoleUpdateRequest
{
    public string Role { get; set; } = string.Empty;
    public decimal? AvgSpending { get; set; }
    public string? Portfolio { get; set; }
}
