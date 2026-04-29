namespace Stackra.Backend.Models.Skills;

public class SkillResponse
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
    public int? AddedBy { get; set; }
}
