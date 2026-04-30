namespace Stackra.Backend.Models.Jobs;

public class DeliverableRequest
{
    public string? Attachment { get; set; }
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
}