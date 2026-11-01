using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using DevPulse.Api.DTOs;

namespace DevPulse.Api.Services;

public class LeetCodeService : ILeetCodeService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<LeetCodeService> _logger;

    public LeetCodeService(HttpClient httpClient, ILogger<LeetCodeService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<LeetCodeUserStatsDto?> GetUserStatsAsync(string username)
    {
        try
        {
            // The GraphQL query asking LeetCode for problem submission counts and ranking
            var query = @"
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                profile {
                  ranking
                }
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
              }
            }";

            // Package query and variables into GraphQL payload
            var requestPayload = new
            {
                query = query,
                variables = new { username = username }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestPayload),
                Encoding.UTF8,
                "application/json"
            );

            // LeetCode GraphQL is always a POST request to https://leetcode.com/graphql
            var response = await _httpClient.PostAsync("graphql", jsonContent);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var root = JsonNode.Parse(responseJson);

            // Extract the user data node
            var matchedUser = root?["data"]?["matchedUser"];
            if (matchedUser == null)
            {
                _logger.LogWarning("LeetCode user '{Username}' not found.", username);
                return null;
            }

            var stats = new LeetCodeUserStatsDto
            {
                Username = username,
                Ranking = matchedUser["profile"]?["ranking"]?.GetValue<int>() ?? 0
            };

            // Parse difficulty counts (All, Easy, Medium, Hard)
            var submissions = matchedUser["submitStats"]?["acSubmissionNum"]?.AsArray();
            if (submissions != null)
            {
                foreach (var item in submissions)
                {
                    var difficulty = item?["difficulty"]?.GetValue<string>();
                    var count = item?["count"]?.GetValue<int>() ?? 0;

                    switch (difficulty)
                    {
                        case "All":
                            stats.TotalSolved = count;
                            break;
                        case "Easy":
                            stats.EasySolved = count;
                            break;
                        case "Medium":
                            stats.MediumSolved = count;
                            break;
                        case "Hard":
                            stats.HardSolved = count;
                            break;
                    }
                }
            }

            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error querying LeetCode GraphQL for {Username}", username);
            throw;
        }
    }
}