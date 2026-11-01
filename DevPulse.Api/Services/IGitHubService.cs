using DevPulse.Api.DTOs;

namespace DevPulse.Api.Services;

public interface IGitHubService
{
    // Fetches user profile metadata (avatar, bio, total repos)
    Task<GitHubUserDto?> GetUserProfileAsync(string username);

    // Fetches top recently updated repositories
    Task<List<GitHubRepoDto>> GetUserRepositoriesAsync(string username);
}