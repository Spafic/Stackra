using System;

namespace Stackra.Backend.Models;

public class Proposal
{
    public int ProposalId { get; set; }
    public string ProposalMessage { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public string ExpJobDuration { get; set; }
    public string AvailCommHours { get; set; }
    public int PostId { get; set; }
    public int FreelancerId { get; set; }
    public DateTime CreatedAt { get; set; }
}
