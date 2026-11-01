using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevPulse.Api.Data;
using DevPulse.Api.Models;

namespace DevPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Route: /api/studylogs
public class StudyLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudyLogsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/studylogs/profile/1
    // Retrieves all study logs for a specific developer profile, newest first
    [HttpGet("profile/{profileId}")]
    public async Task<ActionResult<IEnumerable<StudyLog>>> GetLogsByProfile(int profileId)
    {
        var logs = await _context.StudyLogs
            .Where(s => s.DeveloperProfileId == profileId)
            .OrderByDescending(s => s.SessionDate)
            .ToListAsync();

        return Ok(logs);
    }

    // POST: /api/studylogs
    // Logs a new study session
    [HttpPost]
    public async Task<ActionResult<StudyLog>> CreateLog(StudyLog studyLog)
    {
        // 1. Verify that the developer profile exists
        var profileExists = await _context.DeveloperProfiles.AnyAsync(p => p.Id == studyLog.DeveloperProfileId);
        if (!profileExists)
        {
            return BadRequest(new { message = $"Developer profile with ID {studyLog.DeveloperProfileId} does not exist." });
        }

        // 2. Set current UTC timestamp if not provided
        if (studyLog.SessionDate == default)
        {
            studyLog.SessionDate = DateTime.UtcNow;
        }

        // 3. Save to database
        _context.StudyLogs.Add(studyLog);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLogsByProfile), new { profileId = studyLog.DeveloperProfileId }, studyLog);
    }

    // GET: /api/studylogs/profile/1/summary
    // Calculates total study time and topic breakdowns using LINQ aggregation
    [HttpGet("profile/{profileId}/summary")]
    public async Task<IActionResult> GetStudySummary(int profileId)
    {
        var logs = await _context.StudyLogs
            .Where(s => s.DeveloperProfileId == profileId)
            .ToListAsync();

        if (!logs.Any())
        {
            return Ok(new
            {
                totalMinutes = 0,
                totalHours = 0.0,
                todayMinutes = 0,
                topicBreakdown = new List<object>()
            });
        }

        var today = DateTime.UtcNow.Date;
        var totalMinutes = logs.Sum(s => s.DurationMinutes);
        var todayMinutes = logs.Where(s => s.SessionDate.Date == today).Sum(s => s.DurationMinutes);

        // Group by topic to see where time is being spent (e.g. 120 mins on .NET, 60 mins on LeetCode)
        var topicBreakdown = logs
            .GroupBy(s => s.Topic)
            .Select(g => new
            {
                topic = g.Key,
                totalMinutes = g.Sum(s => s.DurationMinutes),
                sessionCount = g.Count()
            })
            .OrderByDescending(t => t.totalMinutes)
            .ToList();

        return Ok(new
        {
            totalMinutes = totalMinutes,
            totalHours = Math.Round(totalMinutes / 60.0, 1),
            todayMinutes = todayMinutes,
            topicBreakdown = topicBreakdown
        });
    }

    // DELETE: /api/studylogs/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLog(int id)
    {
        var log = await _context.StudyLogs.FindAsync(id);
        if (log == null)
        {
            return NotFound();
        }

        _context.StudyLogs.Remove(log);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}