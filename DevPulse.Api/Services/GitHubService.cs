using System.Net;
using System.Net.Http.Json;
using DevPulse.Api.DTOs;

namespace DevPulse.Api.Services;

public class GitHubService : IGitHubService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GitHubService> _logger;

    // HttpClient is injected via .NET's HttpClientFactory
    public GitHubService(HttpClient httpClient, ILogger<GitHubService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<GitHubUserDto?> GetUserProfileAsync(string username)
    {
        try
        {
            // GitHub endpoint: https://api.github.com/users/{username}
            var response = await _httpClient.GetAsync($"users/{username}");

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                _logger.LogWarning("GitHub user {Username} not found.", username);
                return null;
            }

            response.EnsureSuccessStatusCode();

            // Deserializes JSON directly into our GitHubUserDto
            return await response.Content.ReadFromJsonAsync<GitHubUserDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching GitHub profile for {Username}", username);
            throw;
        }
    }

    public async Task<List<GitHubRepoDto>> GetUserRepositoriesAsync(string username)
    {
        try
        {
            // Fetch top 10 recently updated public repositories
            var response = await _httpClient.GetAsync($"users/{username}/repos?sort=updated&per_page=10");

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return new List<GitHubRepoDto>();
            }

            response.EnsureSuccessStatusCode();

            var repos = await response.Content.ReadFromJsonAsync<List<GitHubRepoDto>>();
            return repos ?? new List<GitHubRepoDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching repositories for {Username}", username);
            throw;
        }
    }
}