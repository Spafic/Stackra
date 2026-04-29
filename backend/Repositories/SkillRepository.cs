using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Skills;

namespace Stackra.Backend.Repositories;

public class SkillRepository
{
    private readonly DatabaseService _databaseService;

    public SkillRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public List<SkillResponse> GetSkills()
    {
        const string sql = @"
SELECT Name, Category, Description, Added_By
FROM SKILLS
ORDER BY Name;";

        var results = new List<SkillResponse>();
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        connection.Open();

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            results.Add(MapSkill(reader));
        }

        return results;
    }

    public SkillResponse? GetSkillByName(string name)
    {
        const string sql = @"
SELECT Name, Category, Description, Added_By
FROM SKILLS
WHERE Name = @name;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@name", name);
        connection.Open();

        using var reader = command.ExecuteReader();
        return reader.Read() ? MapSkill(reader) : null;
    }

    public bool SkillExists(string name)
    {
        const string sql = "SELECT COUNT(1) FROM SKILLS WHERE Name = @name;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@name", name);
        connection.Open();

        return (int)command.ExecuteScalar() > 0;
    }

    public void CreateSkill(SkillCreateRequest request, int? addedBy)
    {
        const string sql = @"
INSERT INTO SKILLS (Name, Category, Description, Added_By)
VALUES (@name, @category, @description, @addedBy);";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@name", request.Name);
        command.Parameters.AddWithValue("@category", (object?)request.Category ?? DBNull.Value);
        command.Parameters.AddWithValue("@description", (object?)request.Description ?? DBNull.Value);
        command.Parameters.AddWithValue("@addedBy", (object?)addedBy ?? DBNull.Value);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void UpdateSkill(string name, SkillUpdateRequest request)
    {
        const string sql = @"
UPDATE SKILLS
SET Category = @category,
    Description = @description
WHERE Name = @name;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@category", (object?)request.Category ?? DBNull.Value);
        command.Parameters.AddWithValue("@description", (object?)request.Description ?? DBNull.Value);
        command.Parameters.AddWithValue("@name", name);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void DeleteSkill(string name)
    {
        const string sql = "DELETE FROM SKILLS WHERE Name = @name;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@name", name);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public List<SkillResponse> GetFreelancerSkills(int freelancerId)
    {
        const string sql = @"
SELECT s.Name, s.Category, s.Description, s.Added_By
FROM FREELANCER_SKILLS fs
INNER JOIN SKILLS s ON s.Name = fs.Skill_Name
WHERE fs.Freelancer_ID = @freelancerId
ORDER BY s.Name;";

        var results = new List<SkillResponse>();
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@freelancerId", freelancerId);
        connection.Open();

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            results.Add(MapSkill(reader));
        }

        return results;
    }

    public bool FreelancerSkillExists(int freelancerId, string skillName)
    {
        const string sql = @"
SELECT COUNT(1)
FROM FREELANCER_SKILLS
WHERE Freelancer_ID = @freelancerId
  AND Skill_Name = @skillName;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@freelancerId", freelancerId);
        command.Parameters.AddWithValue("@skillName", skillName);
        connection.Open();

        return (int)command.ExecuteScalar() > 0;
    }

    public void AddSkillToFreelancer(int freelancerId, string skillName)
    {
        const string sql = @"
INSERT INTO FREELANCER_SKILLS (Freelancer_ID, Skill_Name)
VALUES (@freelancerId, @skillName);";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@freelancerId", freelancerId);
        command.Parameters.AddWithValue("@skillName", skillName);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void RemoveSkillFromFreelancer(int freelancerId, string skillName)
    {
        const string sql = @"
DELETE FROM FREELANCER_SKILLS
WHERE Freelancer_ID = @freelancerId
  AND Skill_Name = @skillName;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@freelancerId", freelancerId);
        command.Parameters.AddWithValue("@skillName", skillName);
        connection.Open();
        command.ExecuteNonQuery();
    }

    private static SkillResponse MapSkill(SqlDataReader reader)
    {
        return new SkillResponse
        {
            Name = reader.GetString(0),
            Category = reader.IsDBNull(1) ? null : reader.GetString(1),
            Description = reader.IsDBNull(2) ? null : reader.GetString(2),
            AddedBy = reader.IsDBNull(3) ? null : reader.GetInt32(3)
        };
    }
}
