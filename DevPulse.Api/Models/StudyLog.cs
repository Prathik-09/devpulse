namespace DevPulse.Api.Models;

public class StudyLog
{
    // Primary Key
    public int Id { get; set; }

    // What was studied (e.g. "ASP.NET Core Web API", "System Design", "Binary Trees")
    public string Topic { get; set; } = string.Empty;

    // Time spent in minutes (e.g. 45, 60, 90)
    public int DurationMinutes { get; set; }

    // "Today I Learned" notes or summary
    public string Notes { get; set; } = string.Empty;

    // When the study session took place
    public DateTime SessionDate { get; set; } = DateTime.UtcNow;

    // ----------------------------------------------------
    // Foreign Key: Links this study log to a specific developer
    // ----------------------------------------------------
    public int DeveloperProfileId { get; set; }

    // Navigation Property: Allows EF Core to navigate from StudyLog -> DeveloperProfile
    public DeveloperProfile? DeveloperProfile { get; set; }
}