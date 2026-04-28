using System.Collections.Generic;

namespace Stackra.Backend.Models.Clients;

public class ClientProfileResponse
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public decimal? AvgSpending { get; set; }
    public List<string> FaxNumbers { get; set; } = new();
    public List<string> PhoneNumbers { get; set; } = new();
}
