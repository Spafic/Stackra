namespace Stackra.Backend.Models.Freelancers;

public class ExperienceRequest
{
    public string Company { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Position { get; set; }
    public string? Description { get; set; }
}
