using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Posts;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/posts")]
public class PostsController : ControllerBase
{
    private readonly PostRepository _postRepository;

    public PostsController(PostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetActivePosts()
    {
        var posts = _postRepository.GetActivePosts();
        return Ok(posts);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("all")]
    public IActionResult GetAllPosts()
    {
        var posts = _postRepository.GetAllPosts();
        return Ok(posts);
    }

    [Authorize(Roles = "client")]
    [HttpGet("me")]
    public IActionResult GetMyPosts()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });
        return Ok(_postRepository.GetPostsByClient(userId.Value));
    }

    [Authorize]
    [HttpGet("{postId:int}")]
    public IActionResult GetPost(int postId)
    {
        var post = _postRepository.GetPostById(postId);
        return post == null ? NotFound(new { message = "Post not found." }) : Ok(post);
    }

    [Authorize(Roles = "client")]
    [HttpPost]
    public IActionResult CreatePost([FromBody] PostCreateRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (string.IsNullOrWhiteSpace(request.JobDescription))
            return BadRequest(new { message = "Job description is required." });

        var postId = _postRepository.CreatePost(userId.Value, request);
        return CreatedAtAction(nameof(GetPost), new { postId }, new { postId });
    }

    [Authorize(Roles = "client")]
    [HttpPut("{postId:int}")]
    public IActionResult UpdatePost(int postId, [FromBody] PostUpdateRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_postRepository.PostExists(postId))
            return NotFound(new { message = "Post not found." });

        if (!_postRepository.IsPostOwner(postId, userId.Value))
            return Forbid();

        _postRepository.UpdatePost(postId, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{postId:int}/status")]
    public IActionResult UpdatePostStatus(int postId, [FromBody] PostStatusRequest request)
    {
        var adminId = GetUserId();
        if (adminId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_postRepository.PostExists(postId))
            return NotFound(new { message = "Post not found." });

        var allowed = new[] { "active", "rejected", "closed", "pending" };
        if (!allowed.Contains(request.Status))
            return BadRequest(new { message = "Invalid status." });

        _postRepository.UpdatePostStatus(postId, request.Status, adminId.Value);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{postId:int}")]
    public IActionResult DeletePost(int postId)
    {
        var userId = GetUserId();
        var role = GetRole();
        if (userId == null) return Unauthorized(new { message = "Invalid token." });

        if (!_postRepository.PostExists(postId))
            return NotFound(new { message = "Post not found." });

        if (role != "admin" && !_postRepository.IsPostOwner(postId, userId.Value))
            return Forbid();

        _postRepository.DeletePost(postId);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    private string? GetRole() => User.FindFirstValue(ClaimTypes.Role);
}