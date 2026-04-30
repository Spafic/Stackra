using System;

namespace Stackra.Backend.Models;

public class Job
{
    public int JobId { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public DateTime? ProjectDeadline { get; set; }
    public int? AcceptedProposalId { get; set; }
    public DateTime CreatedAt { get; set; }
}
