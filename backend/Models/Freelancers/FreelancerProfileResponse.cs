using System.Collections.Generic;

namespace Stackra.Backend.Models.Freelancers;

public class FreelancerProfileResponse
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public string? Portfolio { get; set; }
    public List<ExperienceRequest> Experiences { get; set; } = new();
    public List<SocialRequest> Socials { get; set; } = new();
}
