using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Clients;

namespace Stackra.Backend.Repositories;

public class ClientRepository
{
    private readonly DatabaseService _databaseService;

    public ClientRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public ClientProfileResponse? GetClientProfile(int userId)
    {
        const string sql = @"
SELECT u.User_ID, u.Username, u.Email, u.Role, u.Time_Zone, c.Avg_Spending
FROM USERS u
INNER JOIN CLIENT c ON c.User_ID = u.User_ID
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

        var response = new ClientProfileResponse
        {
            UserId = reader.GetInt32(0),
            Username = reader.GetString(1),
            Email = reader.GetString(2),
            Role = reader.GetString(3),
            TimeZone = reader.IsDBNull(4) ? null : reader.GetString(4),
            AvgSpending = reader.IsDBNull(5) ? null : reader.GetDecimal(5)
        };

        reader.Close();

        response.FaxNumbers = GetClientFaxNumbers(connection, userId);
        response.PhoneNumbers = GetClientPhoneNumbers(connection, userId);

        return response;
    }

    public void UpdateClient(int userId, ClientUpdateRequest request)
    {
        const string sql = @"
UPDATE CLIENT
SET Avg_Spending = @avgSpending
WHERE User_ID = @userId;";

        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@avgSpending", (object?)request.AvgSpending ?? DBNull.Value);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public bool ClientExists(int userId)
    {
        const string sql = "SELECT COUNT(1) FROM CLIENT WHERE User_ID = @userId;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        return (int)command.ExecuteScalar() > 0;
    }

    public void AddFaxNumber(int userId, string faxNumber)
    {
        const string sql = "INSERT INTO CLIENT_FAX (Client_ID, Fax_Number) VALUES (@userId, @faxNumber);";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@faxNumber", faxNumber);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void RemoveFaxNumber(int userId, string faxNumber)
    {
        const string sql = "DELETE FROM CLIENT_FAX WHERE Client_ID = @userId AND Fax_Number = @faxNumber;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@faxNumber", faxNumber);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void AddPhoneNumber(int userId, string phoneNumber)
    {
        const string sql = "INSERT INTO CLIENT_PHONE (Client_ID, Phone_Number) VALUES (@userId, @phoneNumber);";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
        connection.Open();
        command.ExecuteNonQuery();
    }

    public void RemovePhoneNumber(int userId, string phoneNumber)
    {
        const string sql = "DELETE FROM CLIENT_PHONE WHERE Client_ID = @userId AND Phone_Number = @phoneNumber;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
        connection.Open();
        command.ExecuteNonQuery();
    }

    private static List<string> GetClientFaxNumbers(SqlConnection connection, int userId)
    {
        const string sql = "SELECT Fax_Number FROM CLIENT_FAX WHERE Client_ID = @userId ORDER BY Fax_Number;";
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        using var reader = command.ExecuteReader();
        var results = new List<string>();
        while (reader.Read())
        {
            results.Add(reader.GetString(0));
        }
        return results;
    }

    private static List<string> GetClientPhoneNumbers(SqlConnection connection, int userId)
    {
        const string sql = "SELECT Phone_Number FROM CLIENT_PHONE WHERE Client_ID = @userId ORDER BY Phone_Number;";
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        using var reader = command.ExecuteReader();
        var results = new List<string>();
        while (reader.Read())
        {
            results.Add(reader.GetString(0));
        }
        return results;
    }
}
