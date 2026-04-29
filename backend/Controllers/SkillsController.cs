using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Skills;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController : ControllerBase
{
    private readonly SkillRepository _skillRepository;

    public SkillsController(SkillRepository skillRepository)
    {
        _skillRepository = skillRepository;
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetSkills()
    {
        return Ok(_skillRepository.GetSkills());
    }

    [Authorize]
    [HttpGet("{name}")]
    public IActionResult GetSkill(string name)
    {
        var skillName = name.Trim();
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        var skill = _skillRepository.GetSkillByName(skillName);
        return skill == null ? NotFound(new { message = "Skill not found." }) : Ok(skill);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult CreateSkill([FromBody] SkillCreateRequest request)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (_skillRepository.SkillExists(name))
        {
            return Conflict(new { message = "Skill already exists." });
        }

        request.Name = name;
        var adminId = GetUserId();
        _skillRepository.CreateSkill(request, adminId);

        var created = _skillRepository.GetSkillByName(name);
        return CreatedAtAction(nameof(GetSkill), new { name }, created);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{name}")]
    public IActionResult UpdateSkill(string name, [FromBody] SkillUpdateRequest request)
    {
        var skillName = name.Trim();
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_skillRepository.SkillExists(skillName))
        {
            return NotFound(new { message = "Skill not found." });
        }

        _skillRepository.UpdateSkill(skillName, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{name}")]
    public IActionResult DeleteSkill(string name)
    {
        var skillName = name.Trim();
        if (string.IsNullOrWhiteSpace(skillName))
        {
            return BadRequest(new { message = "Skill name is required." });
        }

        if (!_skillRepository.SkillExists(skillName))
        {
            return NotFound(new { message = "Skill not found." });
        }

        _skillRepository.DeleteSkill(skillName);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }
}
