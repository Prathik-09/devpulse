using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevPulse.Api.Data;
using DevPulse.Api.Models;

namespace DevPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // Route will be: /api/profiles
public class ProfilesController : ControllerBase
{
    private readonly AppDbContext _context;

    // Dependency Injection: ASP.NET Core injects our AppDbContext here
    public ProfilesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/profiles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeveloperProfile>>> GetProfiles()
    {
        return await _context.DeveloperProfiles.ToListAsync();
    }

    // GET: api/profiles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DeveloperProfile>> GetProfile(int id)
    {
        // Include the related StudyLogs using EF Core navigation property
        var profile = await _context.DeveloperProfiles
            .Include(p => p.StudyLogs)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (profile == null)
        {
            return NotFound(new { message = $"Profile with ID {id} not found." });
        }

        return profile;
    }

    // POST: api/profiles
    [HttpPost]
    public async Task<ActionResult<DeveloperProfile>> CreateProfile(DeveloperProfile profile)
    {
        _context.DeveloperProfiles.Add(profile);
        await _context.SaveChangesAsync();

        // Returns HTTP 201 Created with a Location header pointing to GET api/profiles/{id}
        return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
    }

    // PUT: api/profiles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, DeveloperProfile profile)
    {
        if (id != profile.Id)
        {
            return BadRequest(new { message = "ID in URL does not match body ID." });
        }

        _context.Entry(profile).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.DeveloperProfiles.Any(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent(); // HTTP 204
    }

    // DELETE: api/profiles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
    {
        var profile = await _context.DeveloperProfiles.FindAsync(id);
        if (profile == null)
        {
            return NotFound();
        }

        _context.DeveloperProfiles.Remove(profile);
        await _context.SaveChangesAsync();

        return NoContent(); // HTTP 204
    }
}