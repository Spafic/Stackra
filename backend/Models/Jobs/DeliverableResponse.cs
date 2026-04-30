namespace Stackra.Backend.Models.Jobs;

public class DeliverableResponse
{
    public int JobId { get; set; }
    public int Number { get; set; }
    public string? Attachment { get; set; }
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
}