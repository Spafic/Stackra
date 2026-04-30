namespace Stackra.Backend.Models.Jobs;

public class JobUpdateRequest
{
    public string? Status { get; set; }
    public DateTime? ProjectDeadline { get; set; }
}