using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    // The DatabaseService is injected automatically by ASP.NET Core
    public DatabaseController(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    [HttpGet("test-connection")]
    public IActionResult TestConnection()
    {
        try
        {
            string message = _databaseService.TestConnection();
            return Ok(new { success = true, message = message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
