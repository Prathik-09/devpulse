using DevPulse.Api.DTOs;

namespace DevPulse.Api.Services;

public interface ILeetCodeService
{
    // Queries LeetCode's GraphQL engine for live problem-solving statistics
    Task<LeetCodeUserStatsDto?> GetUserStatsAsync(string username);
}