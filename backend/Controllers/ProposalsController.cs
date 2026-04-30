using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Proposals;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/proposals")]
public class ProposalsController : ControllerBase
{
    private readonly ProposalRepository _proposalRepository;
    private readonly PostRepository _postRepository;
    private readonly JobRepository _jobRepository;

    public ProposalsController(ProposalRepository proposalRepository, PostRepository postRepository, JobRepository jobRepository)
    {
        _proposalRepository = proposalRepository;
        _postRepository = postRepository;
        _jobRepository = jobRepository;
    }

    [Authorize(Roles = "freelancer")]
    [HttpGet("me")]
    public IActionResult GetMyProposals()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });
        return Ok(_proposalRepository.GetProposalsByFreelancer(userId.Value));
    }

    [Authorize(Roles = "client,admin")]
    [HttpGet("post/{postId:int}")]
    public IActionResult GetProposalsForPost(int postId)
    {
        var userId = GetUserId();
        var role = GetRole();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_postRepository.PostExists(postId))
            return NotFound(new { message = "Post not found." });

        if (role != "admin" && !_postRepository.IsPostOwner(postId, userId.Value))
            return Forbid();

        return Ok(_proposalRepository.GetProposalsByPost(postId));
    }

    [Authorize]
    [HttpGet("{proposalId:int}")]
    public IActionResult GetProposal(int proposalId)
    {
        var proposal = _proposalRepository.GetProposalById(proposalId);
        return proposal == null ? NotFound(new { message = "Proposal not found." }) : Ok(proposal);
    }

    [Authorize(Roles = "freelancer")]
    [HttpPost]
    public IActionResult CreateProposal([FromBody] ProposalCreateRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_postRepository.PostExists(request.PostId))
            return NotFound(new { message = "Post not found." });

        var post = _postRepository.GetPostById(request.PostId);
        if (post?.Status != "active")
            return BadRequest(new { message = "Post is not active." });

        if (_proposalRepository.AlreadySubmitted(request.PostId, userId.Value))
            return Conflict(new { message = "You already submitted a proposal for this post." });

        var proposalId = _proposalRepository.CreateProposal(userId.Value, request);
        return CreatedAtAction(nameof(GetProposal), new { proposalId }, new { proposalId });
    }

    [Authorize(Roles = "client")]
    [HttpPatch("{proposalId:int}/accept")]
    public IActionResult AcceptProposal(int proposalId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        var proposal = _proposalRepository.GetProposalById(proposalId);
        if (proposal == null) return NotFound(new { message = "Proposal not found." });

        if (!_postRepository.IsPostOwner(proposal.PostId, userId.Value))
            return Forbid();

        if (proposal.Status != "pending")
            return BadRequest(new { message = "Proposal is not pending." });

        _proposalRepository.UpdateProposalStatus(proposalId, "accepted");
        _postRepository.UpdatePostStatus(proposal.PostId, "closed");
        var jobId = _jobRepository.CreateJob(proposalId, proposal.Price, null);

        return Ok(new { message = "Proposal accepted.", jobId });
    }

    [Authorize(Roles = "client")]
    [HttpPatch("{proposalId:int}/reject")]
    public IActionResult RejectProposal(int proposalId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        var proposal = _proposalRepository.GetProposalById(proposalId);
        if (proposal == null) return NotFound(new { message = "Proposal not found." });

        if (!_postRepository.IsPostOwner(proposal.PostId, userId.Value))
            return Forbid();

        if (proposal.Status != "pending")
            return BadRequest(new { message = "Proposal is not pending." });

        _proposalRepository.UpdateProposalStatus(proposalId, "rejected");
        return NoContent();
    }

    [Authorize(Roles = "freelancer")]
    [HttpDelete("{proposalId:int}")]
    public IActionResult DeleteProposal(int proposalId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        var proposal = _proposalRepository.GetProposalById(proposalId);
        if (proposal == null) return NotFound(new { message = "Proposal not found." });

        if (!_proposalRepository.IsProposalOwner(proposalId, userId.Value))
            return Forbid();

        if (proposal.Status != "pending")
            return BadRequest(new { message = "Cannot delete a non-pending proposal." });

        _proposalRepository.DeleteProposal(proposalId);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    private string? GetRole() => User.FindFirstValue(ClaimTypes.Role);
}