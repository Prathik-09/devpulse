using Microsoft.AspNetCore.Mvc;
using DevPulse.Api.DTOs;
using DevPulse.Api.Services;

namespace DevPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Route: /api/github
public class GitHubController : ControllerBase
{
    private readonly IGitHubService _gitHubService;

    // Notice we inject the INTERFACE (IGitHubService), not the concrete class!
    public GitHubController(IGitHubService gitHubService)
    {
        _gitHubService = gitHubService;
    }

    // GET: /api/github/{username}
    [HttpGet("{username}")]
    public async Task<ActionResult<GitHubUserDto>> GetUserProfile(string username)
    {
        var user = await _gitHubService.GetUserProfileAsync(username);

        if (user == null)
        {
            return NotFound(new { message = $"GitHub user '{username}' not found." });
        }

        return Ok(user);
    }

    // GET: /api/github/{username}/repos
    [HttpGet("{username}/repos")]
    public async Task<ActionResult<List<GitHubRepoDto>>> GetUserRepositories(string username)
    {
        var repos = await _gitHubService.GetUserRepositoriesAsync(username);
        return Ok(repos);
    }
}