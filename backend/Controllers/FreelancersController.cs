using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Freelancers;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/freelancers")]
public class FreelancersController : ControllerBase
{
    private readonly FreelancerRepository _freelancerRepository;
    private readonly SkillRepository _skillRepository;

    public FreelancersController(FreelancerRepository freelancerRepository, SkillRepository skillRepository)
    {
        _freelancerRepository = freelancerRepository;
        _skillRepository = skillRepository;
    }

    [Authorize(Roles = "freelancer")]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var profile = _freelancerRepository.GetFreelancerProfile(userId.Value);
        return profile == null ? NotFound(new { message = "Freelancer not found." }) : Ok(profile);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{userId:int}")]
    public IActionResult GetFreelancer(int userId)
    {
        var profile = _freelancerRepository.GetFreelancerProfile(userId);
        return profile == null ? NotFound(new { message = "Freelancer not found." }) : Ok(profile);
    }

    [Authorize(Roles = "freelancer")]
    [HttpPut("me")]
    public IActionResult UpdateMe([FromBody] FreelancerUpdateRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (!_freelancerRepository.FreelancerExists(userId.Value))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        _freelancerRepository.UpdateFreelancer(userId.Value, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}")]
    public IActionResult UpdateFreelancer(int userId, [FromBody] FreelancerUpdateRequest request)
    {
        if (!_freelancerRepository.FreelancerExists(userId))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        _freelancerRepository.UpdateFreelancer(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpPost("me/experiences")]
    public IActionResult AddExperience([FromBody] ExperienceRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (string.IsNullOrWhiteSpace(request.Company))
        {
            return BadRequest(new { message = "Company is required." });
        }

        if (_freelancerRepository.ExperienceExists(userId.Value, request.Company, request.StartDate))
        {
            return Conflict(new { message = "An experience at this company with the same start date already exists." });
        }

        _freelancerRepository.AddExperience(userId.Value, request);
        return CreatedAtAction(nameof(GetFreelancer), new { userId = userId.Value }, request);
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{userId:int}/experiences")]
    public IActionResult AddExperienceForFreelancer(int userId, [FromBody] ExperienceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Company))
        {
            return BadRequest(new { message = "Company is required." });
        }

        _freelancerRepository.AddExperience(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpPut("me/experiences")]
    public IActionResult UpdateExperience([FromBody] ExperienceRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        var success = _freelancerRepository.UpdateExperience(userId.Value, request);
        if (!success) return NotFound(new { message = "Experience not found." });

        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}/experiences")]
    public IActionResult UpdateExperienceForFreelancer(int userId, [FromBody] ExperienceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Company))
        {
            return BadRequest(new { message = "Company is required." });
        }

        _freelancerRepository.UpdateExperience(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpDelete("me/experiences")]
    public IActionResult DeleteExperience([FromBody] ExperienceDeleteRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        var success = _freelancerRepository.DeleteExperience(userId.Value, request.Company, request.StartDate);
        if (!success) return NotFound(new { message = "Experience not found." });

        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}/experiences")]
    public IActionResult DeleteExperienceForFreelancer(int userId, [FromBody] ExperienceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Company))
        {
            return BadRequest(new { message = "Company is required." });
        }

        _freelancerRepository.DeleteExperience(userId, request.Company, request.StartDate);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpPost("me/socials")]
    public IActionResult AddSocial([FromBody] SocialRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.AddSocial(userId.Value, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpGet("me/skills")]
    public IActionResult GetMySkills()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (!_freelancerRepository.FreelancerExists(userId.Value))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        var skills = _skillRepository.GetFreelancerSkills(userId.Value);
        return Ok(skills);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{userId:int}/skills")]
    public IActionResult GetFreelancerSkills(int userId)
    {
        if (!_freelancerRepository.FreelancerExists(userId))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        var skills = _skillRepository.GetFreelancerSkills(userId);
        return Ok(skills);
    }

    [Authorize(Roles = "freelancer")]
    [HttpPost("me/skills")]
    public IActionResult AddSkill([FromBody] FreelancerSkillRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var skillName = request.SkillName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_skillRepository.SkillExists(skillName))
        {
            return NotFound(new { message = "Skill not found." });
        }

        if (_skillRepository.FreelancerSkillExists(userId.Value, skillName))
        {
            return Conflict(new { message = "Skill already assigned." });
        }

        _skillRepository.AddSkillToFreelancer(userId.Value, skillName);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{userId:int}/skills")]
    public IActionResult AddSkillForFreelancer(int userId, [FromBody] FreelancerSkillRequest request)
    {
        var skillName = request.SkillName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_freelancerRepository.FreelancerExists(userId))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        if (!_skillRepository.SkillExists(skillName))
        {
            return NotFound(new { message = "Skill not found." });
        }

        if (_skillRepository.FreelancerSkillExists(userId, skillName))
        {
            return Conflict(new { message = "Skill already assigned." });
        }

        _skillRepository.AddSkillToFreelancer(userId, skillName);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpDelete("me/skills")]
    public IActionResult RemoveSkill([FromBody] FreelancerSkillRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var skillName = request.SkillName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_skillRepository.FreelancerSkillExists(userId.Value, skillName))
        {
            return NotFound(new { message = "Skill assignment not found." });
        }

        _skillRepository.RemoveSkillFromFreelancer(userId.Value, skillName);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}/skills")]
    public IActionResult RemoveSkillForFreelancer(int userId, [FromBody] FreelancerSkillRequest request)
    {
        var skillName = request.SkillName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_freelancerRepository.FreelancerExists(userId))
        {
            return NotFound(new { message = "Freelancer not found." });
        }

        if (!_skillRepository.FreelancerSkillExists(userId, skillName))
        {
            return NotFound(new { message = "Skill assignment not found." });
        }

        _skillRepository.RemoveSkillFromFreelancer(userId, skillName);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{userId:int}/socials")]
    public IActionResult AddSocialForFreelancer(int userId, [FromBody] SocialRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.AddSocial(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpPut("me/socials")]
    public IActionResult UpdateSocial([FromBody] SocialRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.UpdateSocial(userId.Value, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}/socials")]
    public IActionResult UpdateSocialForFreelancer(int userId, [FromBody] SocialRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.UpdateSocial(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpDelete("me/socials")]
    public IActionResult DeleteSocial([FromBody] SocialRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.DeleteSocial(userId.Value, request.Url);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}/socials")]
    public IActionResult DeleteSocialForFreelancer(int userId, [FromBody] SocialRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { message = "Url is required." });
        }

        _freelancerRepository.DeleteSocial(userId, request.Url);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }
}
