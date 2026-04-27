using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Auth;

namespace Stackra.Backend.Repositories;

public class AuthRepository
{
    private readonly DatabaseService _databaseService;

    public AuthRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public UserRecord? GetUserByUsernameOrEmail(string usernameOrEmail)
    {
        const string sql = @"
SELECT User_ID, Username, Email, Password, Role, Time_Zone
FROM USERS
WHERE Username = @value OR Email = @value;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@value", usernameOrEmail);
        connection.Open();

        using var reader = command.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return MapUser(reader);
    }

    public UserRecord? GetUserById(int userId)
    {
        const string sql = @"
SELECT User_ID, Username, Email, Password, Role, Time_Zone
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

        return MapUser(reader);
    }

    public bool UserExists(string username, string email)
    {
        const string sql = @"
SELECT COUNT(1)
FROM USERS
WHERE Username = @username OR Email = @email;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@email", email);
        connection.Open();

        var count = (int)command.ExecuteScalar();
        return count > 0;
    }

    public int CreateUser(RegisterRequest request, string passwordHash)
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

    public void UpdatePasswordHash(int userId, string passwordHash)
    {
        const string sql = @"
UPDATE USERS
SET Password = @password
WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@password", passwordHash);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void CreateRoleRow(int userId, RegisterRequest request)
    {
        string sql;
        switch (request.Role)
        {
            case "admin":
                sql = "INSERT INTO ADMIN (User_ID) VALUES (@userId);";
                break;
            case "client":
                sql = "INSERT INTO CLIENT (User_ID, Avg_Spending) VALUES (@userId, @avgSpending);";
                break;
            case "freelancer":
                sql = "INSERT INTO FREELANCER (User_ID, Portfolio) VALUES (@userId, @portfolio);";
                break;
            default:
                throw new InvalidOperationException("Unsupported role.");
        }

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        if (request.Role == "client")
        {
            command.Parameters.AddWithValue("@avgSpending", (object?)request.AvgSpending ?? 0m);
        }
        if (request.Role == "freelancer")
        {
            command.Parameters.AddWithValue("@portfolio", (object?)request.Portfolio ?? DBNull.Value);
        }
        connection.Open();
        command.ExecuteNonQuery();
    }

    public UserProfileResponse? GetUserProfile(int userId)
    {
        const string baseSql = @"
SELECT u.User_ID, u.Username, u.Email, u.Role, u.Time_Zone,
       c.Avg_Spending,
       f.Portfolio
FROM USERS u
LEFT JOIN CLIENT c ON c.User_ID = u.User_ID
LEFT JOIN FREELANCER f ON f.User_ID = u.User_ID
WHERE u.User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(baseSql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();

        using var reader = command.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new UserProfileResponse
        {
            UserId = reader.GetInt32(0),
            Username = reader.GetString(1),
            Email = reader.GetString(2),
            Role = reader.GetString(3),
            TimeZone = reader.IsDBNull(4) ? null : reader.GetString(4),
            AvgSpending = reader.IsDBNull(5) ? null : reader.GetDecimal(5),
            Portfolio = reader.IsDBNull(6) ? null : reader.GetString(6)
        };
    }

    private static UserRecord MapUser(SqlDataReader reader)
    {
        return new UserRecord
        {
            UserId = reader.GetInt32(0),
            Username = reader.GetString(1),
            Email = reader.GetString(2),
            PasswordHash = reader.GetString(3),
            Role = reader.GetString(4),
            TimeZone = reader.IsDBNull(5) ? null : reader.GetString(5)
        };
    }
}
