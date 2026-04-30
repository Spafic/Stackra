namespace Stackra.Backend.Models.Posts;

public class PostUpdateRequest
{
    public string? JobDescription { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public string? AvailCommHours { get; set; }
    public DateTime? ExpectedDeadline { get; set; }
}