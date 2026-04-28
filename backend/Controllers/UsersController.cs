using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Users;
using Stackra.Backend.Repositories;
using Stackra.Backend.Services;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserRepository _userRepository;
    private readonly RoleRepository _roleRepository;
    private readonly AuthService _authService;

    public UsersController(UserRepository userRepository, RoleRepository roleRepository, AuthService authService)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _authService = authService;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(_userRepository.GetUsers());
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{userId:int}")]
    public IActionResult GetUser(int userId)
    {
        var user = _userRepository.GetUserById(userId);
        return user == null ? NotFound(new { message = "User not found." }) : Ok(user);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult CreateUser([FromBody] UserCreateRequest request)
    {
        var role = request.Role.Trim().ToLowerInvariant();
        if (role is not ("client" or "freelancer"))
        {
            return BadRequest(new { message = "Role must be client or freelancer." });
        }

        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username, email, and password are required." });
        }

        if (_userRepository.IsUsernameOrEmailTaken(request.Username, request.Email, 0))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        request.Role = role;
        var passwordHash = _authService.HashPassword(request.Password);
        var userId = _userRepository.CreateUser(request, passwordHash);
        _roleRepository.SetRole(userId, role, request.AvgSpending, request.Portfolio);

        var user = _userRepository.GetUserById(userId);
        return CreatedAtAction(nameof(GetUser), new { userId }, user);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}")]
    public IActionResult UpdateUser(int userId, [FromBody] UserUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Username and email are required." });
        }

        if (_userRepository.GetUserById(userId) == null)
        {
            return NotFound(new { message = "User not found." });
        }

        if (_userRepository.IsUsernameOrEmailTaken(request.Username, request.Email, userId))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        _userRepository.UpdateUser(userId, request);
        return NoContent();
    }

    [Authorize]
    [HttpPut("me")]
    public IActionResult UpdateMe([FromBody] UserUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Username and email are required." });
        }

        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (_userRepository.IsUsernameOrEmailTaken(request.Username, request.Email, userId.Value))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        _userRepository.UpdateUser(userId.Value, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}/role")]
    public IActionResult UpdateRole(int userId, [FromBody] RoleUpdateRequest request)
    {
        var role = request.Role.Trim().ToLowerInvariant();
        if (role is not ("admin" or "client" or "freelancer"))
        {
            return BadRequest(new { message = "Role must be admin, client, or freelancer." });
        }

        if (!_roleRepository.UserExists(userId))
        {
            return NotFound(new { message = "User not found." });
        }

        _roleRepository.SetRole(userId, role, request.AvgSpending, request.Portfolio);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}")]
    public IActionResult DeleteUser(int userId)
    {
        if (_userRepository.GetUserById(userId) == null)
        {
            return NotFound(new { message = "User not found." });
        }

        _userRepository.DeleteUser(userId);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("me")]
    public IActionResult DeleteMe()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        _userRepository.DeleteUser(userId.Value);
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }
}
