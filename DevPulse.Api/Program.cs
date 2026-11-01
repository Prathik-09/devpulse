using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;
using Microsoft.EntityFrameworkCore;
using DevPulse.Api.Data;
using DevPulse.Api.Services;
using Microsoft.Extensions.Options;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Typed HttpClient for GitHub API
builder.Services.AddHttpClient<IGitHubService, GitHubService>(client =>
{
    client.BaseAddress = new Uri("https://api.github.com/");
    // GitHub API requires a User-Agent header
    client.DefaultRequestHeaders.Add("User-Agent", "DevPulse-App");
});

// Register Typed HttpClient for LeetCode GraphQL API
builder.Services.AddHttpClient<ILeetCodeService, LeetCodeService>(client =>
{
    client.BaseAddress = new Uri("https://leetcode.com/");
    client.DefaultRequestHeaders.Add("User-Agent", "DevPulse-App");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger/OpenAPI middleware (Swagger UI at /swagger)
    app.UseSwagger();
    app.UseSwaggerUI();

    // Also map minimal API OpenAPI endpoints if present
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
