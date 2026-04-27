using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Auth;
using Stackra.Backend.Repositories;
using Stackra.Backend.Services;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthRepository _authRepository;
    private readonly AuthService _authService;

    public AuthController(AuthRepository authRepository, AuthService authService)
    {
        _authRepository = authRepository;
        _authService = authService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        request.Role = request.Role.Trim().ToLowerInvariant();
        if (request.Role is not ("admin" or "client" or "freelancer"))
        {
            return BadRequest(new { message = "Role must be admin, client, or freelancer." });
        }

        if (_authRepository.UserExists(request.Username, request.Email))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        var passwordHash = _authService.HashPassword(request.Password);
        var userId = _authRepository.CreateUser(request, passwordHash);
        _authRepository.CreateRoleRow(userId, request);

        var user = _authRepository.GetUserById(userId);
        if (user == null)
        {
            return StatusCode(500, new { message = "Failed to load user after registration." });
        }

        var accessToken = _authService.GenerateAccessToken(user);
        var refreshToken = _authService.GenerateRefreshToken(user);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.UserId,
            Username = user.Username,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _authRepository.GetUserByUsernameOrEmail(request.UsernameOrEmail);
        if (user == null || !_authService.TryVerifyPassword(request.Password, user.PasswordHash, out var needsUpgrade))
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        if (needsUpgrade)
        {
            var newHash = _authService.HashPassword(request.Password);
            _authRepository.UpdatePasswordHash(user.UserId, newHash);
        }

        var accessToken = _authService.GenerateAccessToken(user);
        var refreshToken = _authService.GenerateRefreshToken(user);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.UserId,
            Username = user.Username,
            Role = user.Role
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        if (!_authService.TryValidateRefreshToken(request.RefreshToken, out var userId))
        {
            return Unauthorized(new { message = "Invalid refresh token." });
        }

        var user = _authRepository.GetUserById(userId);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var accessToken = _authService.GenerateAccessToken(user);
        var newRefreshToken = _authService.GenerateRefreshToken(user);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            UserId = user.UserId,
            Username = user.Username,
            Role = user.Role
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out (client should delete tokens)." });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var profile = _authRepository.GetUserProfile(userId);
        if (profile == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(profile);
    }
}
