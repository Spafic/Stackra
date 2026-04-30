using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Jobs;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly JobRepository _jobRepository;

    public JobsController(JobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public IActionResult GetAllJobs()
    {
        return Ok(_jobRepository.GetAllJobs());
    }

    [Authorize(Roles = "freelancer")]
    [HttpGet("me")]
    public IActionResult GetMyJobsAsFreelancer()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });
        return Ok(_jobRepository.GetJobsByFreelancer(userId.Value));
    }

    [Authorize(Roles = "client")]
    [HttpGet("my-client-jobs")]
    public IActionResult GetMyJobsAsClient()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });
        return Ok(_jobRepository.GetJobsByClient(userId.Value));
    }

    [Authorize]
    [HttpGet("{jobId:int}")]
    public IActionResult GetJob(int jobId)
    {
        var job = _jobRepository.GetJobById(jobId);
        return job == null ? NotFound(new { message = "Job not found." }) : Ok(job);
    }

    [Authorize]
    [HttpPut("{jobId:int}")]
    public IActionResult UpdateJob(int jobId, [FromBody] JobUpdateRequest request)
    {
        var userId = GetUserId();
        var role = GetRole();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_jobRepository.JobExists(jobId))
            return NotFound(new { message = "Job not found." });

        if (role == "freelancer" && !_jobRepository.IsJobFreelancer(jobId, userId.Value))
            return Forbid();

        if (role == "client" && !_jobRepository.IsJobClient(jobId, userId.Value))
            return Forbid();

        var allowed = new[] { "in_progress", "completed", "cancelled", "disputed" };
        if (request.Status != null && !allowed.Contains(request.Status))
            return BadRequest(new { message = "Invalid status." });

        _jobRepository.UpdateJob(jobId, request);
        return NoContent();
    }

    [Authorize]
    [HttpGet("{jobId:int}/deliverables")]
    public IActionResult GetDeliverables(int jobId)
    {
        if (!_jobRepository.JobExists(jobId))
            return NotFound(new { message = "Job not found." });

        return Ok(_jobRepository.GetDeliverables(jobId));
    }

    [Authorize(Roles = "freelancer")]
    [HttpPost("{jobId:int}/deliverables")]
    public IActionResult AddDeliverable(int jobId, [FromBody] DeliverableRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_jobRepository.JobExists(jobId))
            return NotFound(new { message = "Job not found." });

        if (!_jobRepository.IsJobFreelancer(jobId, userId.Value))
            return Forbid();

        var number = _jobRepository.GetNextDeliverableNumber(jobId);
        _jobRepository.AddDeliverable(jobId, number, request);
        return CreatedAtAction(nameof(GetDeliverables), new { jobId }, new { jobId, number });
    }

    [Authorize(Roles = "freelancer")]
    [HttpDelete("{jobId:int}/deliverables/{number:int}")]
    public IActionResult DeleteDeliverable(int jobId, int number)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_jobRepository.JobExists(jobId))
            return NotFound(new { message = "Job not found." });

        if (!_jobRepository.IsJobFreelancer(jobId, userId.Value))
            return Forbid();

        var deliverable = _jobRepository.GetDeliverable(jobId, number);
        if (deliverable == null)
            return NotFound(new { message = "Deliverable not found." });

        _jobRepository.DeleteDeliverable(jobId, number);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    private string? GetRole() => User.FindFirstValue(ClaimTypes.Role);
}