namespace Stackra.Backend.Models.Skills;

public class SkillCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
}
