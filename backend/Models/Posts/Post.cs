using System;

namespace Stackra.Backend.Models;

public class Post
{
    public int PostId { get; set; }
    public string JobDescription { get; set; }
    public string Status { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public string AvailCommHours { get; set; }
    public DateTime? ExpectedDeadline { get; set; }
    public int CreatedByClientId { get; set; }
    public int? AcceptedByAdminId { get; set; }
    public DateTime CreatedAt { get; set; }
}
