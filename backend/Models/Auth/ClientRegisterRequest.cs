using System.Collections.Generic;

namespace Stackra.Backend.Models.Clients;

public class ClientRegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public decimal? AvgSpending { get; set; }
    public List<string>? FaxNumbers { get; set; }
    public List<string>? PhoneNumbers { get; set; }
}
