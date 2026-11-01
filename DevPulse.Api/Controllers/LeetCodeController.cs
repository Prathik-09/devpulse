using Microsoft.AspNetCore.Mvc;
using DevPulse.Api.DTOs;
using DevPulse.Api.Services;

namespace DevPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Route: /api/leetcode
public class LeetCodeController : ControllerBase
{
    private readonly ILeetCodeService _leetCodeService;

    // Inject the ILeetCodeService interface
    public LeetCodeController(ILeetCodeService leetCodeService)
    {
        _leetCodeService = leetCodeService;
    }

    // GET: /api/leetcode/{username}
    [HttpGet("{username}")]
    public async Task<ActionResult<LeetCodeUserStatsDto>> GetUserStats(string username)
    {
        var stats = await _leetCodeService.GetUserStatsAsync(username);

        if (stats == null)
        {
            return NotFound(new { message = $"LeetCode user '{username}' was not found." });
        }

        return Ok(stats);
    }
}