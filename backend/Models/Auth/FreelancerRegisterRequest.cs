using System.Collections.Generic;

namespace Stackra.Backend.Models.Freelancers;

public class FreelancerRegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? TimeZone { get; set; }
    public string? Portfolio { get; set; }
    public List<ExperienceRequest>? Experiences { get; set; }
    public List<SocialRequest>? Socials { get; set; }
}
