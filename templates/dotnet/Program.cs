using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var projectName = "{{PROJECT}}";
var org = "{{ORG}}";
var environment = builder.Configuration["ENVIRONMENT"] ?? "{{ENV}}";

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (environment == "dev")
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
        else
        {
            policy.WithOrigins(builder.Configuration["ALLOWED_ORIGINS"]?.Split(',') ?? Array.Empty<string>())
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

// Health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Endpoints
app.MapGet("/", () => new
{
    message = $"Welcome to {projectName}",
    org = org,
    env = environment,
    project = projectName
});

app.MapGet("/health", () => new
{
    status = "healthy",
    environment = environment,
    version = "1.0.0"
});

app.MapGet("/ready", () => new
{
    status = "ready"
});

app.MapHealthChecks("/healthz");

app.Logger.LogInformation("{Project} starting in {Environment} mode", projectName, environment);

app.Run();

// Make Program class accessible for testing
public partial class Program { }
