using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Auth;
using Stackra.Backend.Models.Clients;
using Stackra.Backend.Models.Freelancers;
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
    public IActionResult RegisterDeprecated()
    {
        return BadRequest(new { message = "Use /api/auth/register/client or /api/auth/register/freelancer." });
    }

    [HttpPost("register/client")]
    public IActionResult RegisterClient([FromBody] ClientRegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username, email, and password are required." });
        }

        if (_authRepository.UserExists(request.Username, request.Email))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        var passwordHash = _authService.HashPassword(request.Password);
        var userId = _authRepository.CreateClientAccount(request, passwordHash);

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

    [HttpPost("register/freelancer")]
    public IActionResult RegisterFreelancer([FromBody] FreelancerRegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username, email, and password are required." });
        }

        if (_authRepository.UserExists(request.Username, request.Email))
        {
            return Conflict(new { message = "Username or email already exists." });
        }

        var passwordHash = _authService.HashPassword(request.Password);
        var userId = _authRepository.CreateFreelancerAccount(request, passwordHash);

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
            return Unauthorized(new { message = "Email or password is not valid." });
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
