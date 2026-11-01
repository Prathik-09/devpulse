namespace DevPulse.Api.DTOs;

// Clean DTO returned by our API
public class LeetCodeUserStatsDto
{
    public string Username { get; set; } = string.Empty;
    public int TotalSolved { get; set; }
    public int EasySolved { get; set; }
    public int MediumSolved { get; set; }
    public int HardSolved { get; set; }
    public int Ranking { get; set; }
}