namespace DevPulse.Api.Models;

public class DeveloperProfile
{
    // Primary Key
    public int Id { get; set; }

    // User Information
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Platform Usernames for Automated Sync
    public string GitHubUsername { get; set; } = string.Empty;
    public string LeetCodeUsername { get; set; } = string.Empty;

    // Goal Tracking (e.g. target 500 LeetCode problems, 60 mins study/day)
    public int TargetLeetCodeGoal { get; set; } = 500;
    public int TargetDailyStudyMinutes { get; set; } = 60;

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Property: One Developer has Many StudyLogs
    public List<StudyLog> StudyLogs { get; set; } = new();
}