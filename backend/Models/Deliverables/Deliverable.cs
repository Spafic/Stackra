using System;

namespace Stackra.Backend.Models;

public class Deliverable
{
    public int JobId { get; set; }
    public int Number { get; set; }
    public string Attachment { get; set; }
    public string Description { get; set; }
    public DateTime? Deadline { get; set; }
}
