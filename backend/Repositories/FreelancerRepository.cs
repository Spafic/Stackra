using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Freelancers;

namespace Stackra.Backend.Repositories;

public class FreelancerRepository
{
    private readonly DatabaseService _databaseService;

    public FreelancerRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public FreelancerProfileResponse? GetFreelancerProfile(int userId)
    {
        const string sql = @"
SELECT u.User_ID, u.Username, u.Email, u.Role, u.Time_Zone, f.Portfolio
FROM USERS u
INNER JOIN FREELANCER f ON f.User_ID = u.User_ID
WHERE u.User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();

        using var reader = command.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        var response = new FreelancerProfileResponse
        {
            UserId = reader.GetInt32(0),
            Username = reader.GetString(1),
            Email = reader.GetString(2),
            Role = reader.GetString(3),
            TimeZone = reader.IsDBNull(4) ? null : reader.GetString(4),
            Portfolio = reader.IsDBNull(5) ? null : reader.GetString(5)
        };

        reader.Close();

        response.Experiences = GetExperiences(connection, userId);
        response.Socials = GetSocials(connection, userId);

        return response;
    }

    public bool FreelancerExists(int userId)
    {
        const string sql = "SELECT COUNT(1) FROM FREELANCER WHERE User_ID = @userId;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        return (int)command.ExecuteScalar() > 0;
    }

    public void UpdateFreelancer(int userId, FreelancerUpdateRequest request)
    {
        const string sql = @"
UPDATE FREELANCER
SET Portfolio = @portfolio
WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@portfolio", (object?)request.Portfolio ?? DBNull.Value);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void AddExperience(int userId, ExperienceRequest request)
    {
        const string sql = @"
INSERT INTO EXPERIENCE (Freelancer_ID, Company, Start_Date, End_Date, Position, Description)
VALUES (@userId, @company, @startDate, @endDate, @position, @description);";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@company", request.Company);
        command.Parameters.AddWithValue("@startDate", request.StartDate);
        command.Parameters.AddWithValue("@endDate", (object?)request.EndDate ?? DBNull.Value);
        command.Parameters.AddWithValue("@position", (object?)request.Position ?? DBNull.Value);
        command.Parameters.AddWithValue("@description", (object?)request.Description ?? DBNull.Value);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void UpdateExperience(int userId, ExperienceRequest request)
    {
        const string sql = @"
UPDATE EXPERIENCE
SET End_Date = @endDate,
    Position = @position,
    Description = @description
WHERE Freelancer_ID = @userId
  AND Company = @company
  AND Start_Date = @startDate;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@company", request.Company);
        command.Parameters.AddWithValue("@startDate", request.StartDate);
        command.Parameters.AddWithValue("@endDate", (object?)request.EndDate ?? DBNull.Value);
        command.Parameters.AddWithValue("@position", (object?)request.Position ?? DBNull.Value);
        command.Parameters.AddWithValue("@description", (object?)request.Description ?? DBNull.Value);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void DeleteExperience(int userId, string company, DateTime startDate)
    {
        const string sql = @"
DELETE FROM EXPERIENCE
WHERE Freelancer_ID = @userId
  AND Company = @company
  AND Start_Date = @startDate;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@company", company);
        command.Parameters.AddWithValue("@startDate", startDate);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void AddSocial(int userId, SocialRequest request)
    {
        const string sql = "INSERT INTO SOCIALS (Freelancer_ID, URL, Type) VALUES (@userId, @url, @type);";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@url", request.Url);
        command.Parameters.AddWithValue("@type", (object?)request.Type ?? DBNull.Value);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void UpdateSocial(int userId, SocialRequest request)
    {
        const string sql = @"
UPDATE SOCIALS
SET Type = @type
WHERE Freelancer_ID = @userId
  AND URL = @url;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@url", request.Url);
        command.Parameters.AddWithValue("@type", (object?)request.Type ?? DBNull.Value);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void DeleteSocial(int userId, string url)
    {
        const string sql = "DELETE FROM SOCIALS WHERE Freelancer_ID = @userId AND URL = @url;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@url", url);
        connection.Open();
        command.ExecuteNonQuery();
    }

    private static List<ExperienceRequest> GetExperiences(SqlConnection connection, int userId)
    {
        const string sql = @"
SELECT Company, Start_Date, End_Date, Position, Description
FROM EXPERIENCE
WHERE Freelancer_ID = @userId
ORDER BY Start_Date DESC, Company;";

        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        using var reader = command.ExecuteReader();
        var results = new List<ExperienceRequest>();
        while (reader.Read())
        {
            results.Add(new ExperienceRequest
            {
                Company = reader.GetString(0),
                StartDate = reader.GetDateTime(1),
                EndDate = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                Position = reader.IsDBNull(3) ? null : reader.GetString(3),
                Description = reader.IsDBNull(4) ? null : reader.GetString(4)
            });
        }
        return results;
    }

    private static List<SocialRequest> GetSocials(SqlConnection connection, int userId)
    {
        const string sql = @"
SELECT URL, Type
FROM SOCIALS
WHERE Freelancer_ID = @userId
ORDER BY URL;";

        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        using var reader = command.ExecuteReader();
        var results = new List<SocialRequest>();
        while (reader.Read())
        {
            results.Add(new SocialRequest
            {
                Url = reader.GetString(0),
                Type = reader.IsDBNull(1) ? null : reader.GetString(1)
            });
        }
        return results;
    }
}
