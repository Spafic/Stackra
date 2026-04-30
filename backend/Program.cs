using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Stackra.Backend.Options;
using Stackra.Backend.Repositories;
using Stackra.Backend.Services;
using System.Text;

Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Register our new DatabaseService for Dependency Injection
builder.Services.AddScoped<DatabaseService>();
builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<ClientRepository>();
builder.Services.AddScoped<FreelancerRepository>();
builder.Services.AddScoped<SkillRepository>();
builder.Services.AddScoped<PostRepository>();
builder.Services.AddScoped<ProposalRepository>();
builder.Services.AddScoped<JobRepository>();
builder.Services.AddSingleton<AuthService>();

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = Environment.GetEnvironmentVariable("SECRET_KEY")
    ?? jwtSection.GetValue<string>("SecretKey");
if (string.IsNullOrWhiteSpace(jwtSecret))
{
    throw new InvalidOperationException("Jwt:SecretKey is required.");
}

var accessMinutesEnv = Environment.GetEnvironmentVariable("ACCESS_TOKEN_EXPIRE_MINUTES");
var refreshDaysEnv = Environment.GetEnvironmentVariable("REFRESH_TOKEN_EXPIRE_DAYS");
var accessMinutes = int.TryParse(accessMinutesEnv, out var accessParsed)
    ? accessParsed
    : jwtSection.GetValue<int>("AccessTokenMinutes");
var refreshDays = int.TryParse(refreshDaysEnv, out var refreshParsed)
    ? refreshParsed
    : jwtSection.GetValue<int>("RefreshTokenDays");

builder.Services.Configure<JwtOptions>(options =>
{
    options.Issuer = jwtSection.GetValue<string>("Issuer") ?? "Stackra";
    options.Audience = jwtSection.GetValue<string>("Audience") ?? "Stackra";
    options.SecretKey = jwtSecret;
    options.AccessTokenMinutes = accessMinutes > 0 ? accessMinutes : 15;
    options.RefreshTokenDays = refreshDays > 0 ? refreshDays : 7;
});

var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtSection.GetValue<string>("Issuer") ?? "Stackra",
            ValidAudience = jwtSection.GetValue<string>("Audience") ?? "Stackra",
            IssuerSigningKey = jwtKey,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token here"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
