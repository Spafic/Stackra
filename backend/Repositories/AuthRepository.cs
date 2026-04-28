using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Auth;
using Stackra.Backend.Models.Clients;
using Stackra.Backend.Models.Freelancers;
using System.Linq;

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

    public int CreateUser(string username, string email, string passwordHash, string? timeZone, string role)
    {
        const string sql = @"
INSERT INTO USERS (Username, Password, Email, Time_Zone, Role)
OUTPUT INSERTED.User_ID
VALUES (@username, @password, @email, @timeZone, @role);";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@password", passwordHash);
        command.Parameters.AddWithValue("@email", email);
        command.Parameters.AddWithValue("@timeZone", (object?)timeZone ?? DBNull.Value);
        command.Parameters.AddWithValue("@role", role);
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

    public int CreateClientAccount(ClientRegisterRequest request, string passwordHash)
    {
        using var connection = _databaseService.CreateConnection();
        connection.Open();

        using var transaction = connection.BeginTransaction();
        try
        {
            var userId = InsertUser(connection, transaction, request.Username, request.Email, passwordHash, request.TimeZone, "client");
            InsertClient(connection, transaction, userId, request.AvgSpending ?? 0m);

            if (request.FaxNumbers != null)
            {
                foreach (var fax in request.FaxNumbers.Where(f => !string.IsNullOrWhiteSpace(f)))
                {
                    InsertClientFax(connection, transaction, userId, fax.Trim());
                }
            }

            if (request.PhoneNumbers != null)
            {
                foreach (var phone in request.PhoneNumbers.Where(p => !string.IsNullOrWhiteSpace(p)))
                {
                    InsertClientPhone(connection, transaction, userId, phone.Trim());
                }
            }

            transaction.Commit();
            return userId;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public int CreateFreelancerAccount(FreelancerRegisterRequest request, string passwordHash)
    {
        using var connection = _databaseService.CreateConnection();
        connection.Open();

        using var transaction = connection.BeginTransaction();
        try
        {
            var userId = InsertUser(connection, transaction, request.Username, request.Email, passwordHash, request.TimeZone, "freelancer");
            InsertFreelancer(connection, transaction, userId, request.Portfolio);

            if (request.Experiences != null)
            {
                foreach (var experience in request.Experiences)
                {
                    InsertExperience(connection, transaction, userId, experience);
                }
            }

            if (request.Socials != null)
            {
                foreach (var social in request.Socials)
                {
                    InsertSocial(connection, transaction, userId, social);
                }
            }

            transaction.Commit();
            return userId;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
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

    private static int InsertUser(SqlConnection connection, SqlTransaction transaction, string username, string email, string passwordHash, string? timeZone, string role)
    {
        const string sql = @"
INSERT INTO USERS (Username, Password, Email, Time_Zone, Role)
OUTPUT INSERTED.User_ID
VALUES (@username, @password, @email, @timeZone, @role);";

        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@username", username);
        command.Parameters.AddWithValue("@password", passwordHash);
        command.Parameters.AddWithValue("@email", email);
        command.Parameters.AddWithValue("@timeZone", (object?)timeZone ?? DBNull.Value);
        command.Parameters.AddWithValue("@role", role);
        return (int)command.ExecuteScalar();
    }

    private static void InsertClient(SqlConnection connection, SqlTransaction transaction, int userId, decimal avgSpending)
    {
        const string sql = "INSERT INTO CLIENT (User_ID, Avg_Spending) VALUES (@userId, @avgSpending);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@avgSpending", avgSpending);
        command.ExecuteNonQuery();
    }

    private static void InsertClientFax(SqlConnection connection, SqlTransaction transaction, int userId, string faxNumber)
    {
        const string sql = "INSERT INTO CLIENT_FAX (Client_ID, Fax_Number) VALUES (@userId, @faxNumber);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@faxNumber", faxNumber);
        command.ExecuteNonQuery();
    }

    private static void InsertClientPhone(SqlConnection connection, SqlTransaction transaction, int userId, string phoneNumber)
    {
        const string sql = "INSERT INTO CLIENT_PHONE (Client_ID, Phone_Number) VALUES (@userId, @phoneNumber);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
        command.ExecuteNonQuery();
    }

    private static void InsertFreelancer(SqlConnection connection, SqlTransaction transaction, int userId, string? portfolio)
    {
        const string sql = "INSERT INTO FREELANCER (User_ID, Portfolio) VALUES (@userId, @portfolio);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@portfolio", (object?)portfolio ?? DBNull.Value);
        command.ExecuteNonQuery();
    }

    private static void InsertExperience(SqlConnection connection, SqlTransaction transaction, int userId, ExperienceRequest experience)
    {
        const string sql = @"
INSERT INTO EXPERIENCE (Freelancer_ID, Company, Start_Date, End_Date, Position, Description)
VALUES (@userId, @company, @startDate, @endDate, @position, @description);";

        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@company", experience.Company);
        command.Parameters.AddWithValue("@startDate", experience.StartDate);
        command.Parameters.AddWithValue("@endDate", (object?)experience.EndDate ?? DBNull.Value);
        command.Parameters.AddWithValue("@position", (object?)experience.Position ?? DBNull.Value);
        command.Parameters.AddWithValue("@description", (object?)experience.Description ?? DBNull.Value);
        command.ExecuteNonQuery();
    }

    private static void InsertSocial(SqlConnection connection, SqlTransaction transaction, int userId, SocialRequest social)
    {
        const string sql = "INSERT INTO SOCIALS (Freelancer_ID, URL, Type) VALUES (@userId, @url, @type);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@url", social.Url);
        command.Parameters.AddWithValue("@type", (object?)social.Type ?? DBNull.Value);
        command.ExecuteNonQuery();
    }
}
