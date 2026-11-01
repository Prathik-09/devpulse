using Microsoft.EntityFrameworkCore;
using DevPulse.Api.Models;

namespace DevPulse.Api.Data;

public class AppDbContext : DbContext
{
    // Constructor accepting DbContextOptions to configure connection strings & providers
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // These DbSets become the SQL Tables in our database
    public DbSet<DeveloperProfile> DeveloperProfiles { get; set; }
    public DbSet<StudyLog> StudyLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Optional: Fluent API configuration for relationship integrity
        modelBuilder.Entity<StudyLog>()
            .HasOne(s => s.DeveloperProfile)
            .WithMany(d => d.StudyLogs)
            .HasForeignKey(s => s.DeveloperProfileId)
            .OnDelete(DeleteBehavior.Cascade); // Deleting a profile also removes their study logs
    }
}