using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Users;

namespace Stackra.Backend.Repositories;

public class UserRepository
{
    private readonly DatabaseService _databaseService;

    public UserRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public List<UserSummaryResponse> GetUsers()
    {
        const string sql = @"
SELECT User_ID, Username, Email, Role, Time_Zone, Created_At
FROM USERS
ORDER BY User_ID;";

        var results = new List<UserSummaryResponse>();
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        connection.Open();

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            results.Add(new UserSummaryResponse
            {
                UserId = reader.GetInt32(0),
                Username = reader.GetString(1),
                Email = reader.GetString(2),
                Role = reader.GetString(3),
                TimeZone = reader.IsDBNull(4) ? null : reader.GetString(4),
                CreatedAt = reader.GetDateTime(5)
            });
        }

        return results;
    }

    public UserSummaryResponse? GetUserById(int userId)
    {
        const string sql = @"
SELECT User_ID, Username, Email, Role, Time_Zone, Created_At
FROM USERS
WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();

        using var reader = command.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new UserSummaryResponse
        {
            UserId = reader.GetInt32(0),
            Username = reader.GetString(1),
            Email = reader.GetString(2),
            Role = reader.GetString(3),
            TimeZone = reader.IsDBNull(4) ? null : reader.GetString(4),
            CreatedAt = reader.GetDateTime(5)
        };
    }

    public int CreateUser(UserCreateRequest request, string passwordHash)
    {
        const string sql = @"
INSERT INTO USERS (Username, Password, Email, Time_Zone, Role)
OUTPUT INSERTED.User_ID
VALUES (@username, @password, @email, @timeZone, @role);";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@username", request.Username);
        command.Parameters.AddWithValue("@password", passwordHash);
        command.Parameters.AddWithValue("@email", request.Email);
        command.Parameters.AddWithValue("@timeZone", (object?)request.TimeZone ?? DBNull.Value);
        command.Parameters.AddWithValue("@role", request.Role);
        connection.Open();

        return (int)command.ExecuteScalar();
    }

    public bool IsUsernameOrEmailTaken(string username, string email, int excludeUserId)
    {
        const string sql = @"
SELECT COUNT(1)
FROM USERS
WHERE (Username = @username OR Email = @email)
  AND User_ID <> @excludeUserId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@email", email);
        command.Parameters.AddWithValue("@excludeUserId", excludeUserId);
        connection.Open();

        var count = (int)command.ExecuteScalar();
        return count > 0;
    }

    public void UpdateUser(int userId, UserUpdateRequest request)
    {
        const string sql = @"
UPDATE USERS
SET Username = @username,
    Email = @email,
    Time_Zone = @timeZone
WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@username", request.Username);
        command.Parameters.AddWithValue("@email", request.Email);
        command.Parameters.AddWithValue("@timeZone", (object?)request.TimeZone ?? DBNull.Value);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void DeleteUser(int userId)
    {
        const string sql = "DELETE FROM USERS WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        command.ExecuteNonQuery();
    }
}
