namespace Stackra.Backend.Models.Proposals;

public class ProposalCreateRequest
{
    public string? ProposalMessage { get; set; }
    public decimal? Price { get; set; }
    public string? ExpJobDuration { get; set; }
    public string? AvailCommHours { get; set; }
    public int PostId { get; set; }
}