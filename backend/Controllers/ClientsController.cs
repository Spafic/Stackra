using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models.Clients;
using Stackra.Backend.Repositories;
using System.Security.Claims;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/clients")]
public class ClientsController : ControllerBase
{
    private readonly ClientRepository _clientRepository;

    public ClientsController(ClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    [Authorize(Roles = "client")]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var profile = _clientRepository.GetClientProfile(userId.Value);
        return profile == null ? NotFound(new { message = "Client not found." }) : Ok(profile);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{userId:int}")]
    public IActionResult GetClient(int userId)
    {
        var profile = _clientRepository.GetClientProfile(userId);
        return profile == null ? NotFound(new { message = "Client not found." }) : Ok(profile);
    }

    [Authorize(Roles = "client")]
    [HttpPut("me")]
    public IActionResult UpdateMe([FromBody] ClientUpdateRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (!_clientRepository.ClientExists(userId.Value))
        {
            return NotFound(new { message = "Client not found." });
        }

        _clientRepository.UpdateClient(userId.Value, request);
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{userId:int}")]
    public IActionResult UpdateClient(int userId, [FromBody] ClientUpdateRequest request)
    {
        if (!_clientRepository.ClientExists(userId))
        {
            return NotFound(new { message = "Client not found." });
        }

        _clientRepository.UpdateClient(userId, request);
        return NoContent();
    }

    [Authorize(Roles = "client")]
    [HttpPost("me/fax")]
    public IActionResult AddFax([FromBody] ClientFaxRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.FaxNumber))
        {
            return BadRequest(new { message = "Fax number is required." });
        }

        _clientRepository.AddFaxNumber(userId.Value, request.FaxNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{userId:int}/fax")]
    public IActionResult AddFaxForClient(int userId, [FromBody] ClientFaxRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FaxNumber))
        {
            return BadRequest(new { message = "Fax number is required." });
        }

        _clientRepository.AddFaxNumber(userId, request.FaxNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "client")]
    [HttpDelete("me/fax")]
    public IActionResult RemoveFax([FromBody] ClientFaxRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.FaxNumber))
        {
            return BadRequest(new { message = "Fax number is required." });
        }

        _clientRepository.RemoveFaxNumber(userId.Value, request.FaxNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}/fax")]
    public IActionResult RemoveFaxForClient(int userId, [FromBody] ClientFaxRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FaxNumber))
        {
            return BadRequest(new { message = "Fax number is required." });
        }

        _clientRepository.RemoveFaxNumber(userId, request.FaxNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "client")]
    [HttpPost("me/phone")]
    public IActionResult AddPhone([FromBody] ClientPhoneRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(new { message = "Phone number is required." });
        }

        _clientRepository.AddPhoneNumber(userId.Value, request.PhoneNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{userId:int}/phone")]
    public IActionResult AddPhoneForClient(int userId, [FromBody] ClientPhoneRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(new { message = "Phone number is required." });
        }

        _clientRepository.AddPhoneNumber(userId, request.PhoneNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "client")]
    [HttpDelete("me/phone")]
    public IActionResult RemovePhone([FromBody] ClientPhoneRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(new { message = "Phone number is required." });
        }

        _clientRepository.RemovePhoneNumber(userId.Value, request.PhoneNumber.Trim());
        return NoContent();
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{userId:int}/phone")]
    public IActionResult RemovePhoneForClient(int userId, [FromBody] ClientPhoneRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(new { message = "Phone number is required." });
        }

        _clientRepository.RemovePhoneNumber(userId, request.PhoneNumber.Trim());
        return NoContent();
    }

    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }
}
