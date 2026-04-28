using Microsoft.Data.SqlClient;

namespace Stackra.Backend.Repositories;

public class RoleRepository
{
    private readonly DatabaseService _databaseService;

    public RoleRepository(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public bool UserExists(int userId)
    {
        const string sql = "SELECT COUNT(1) FROM USERS WHERE User_ID = @userId;";
        using var connection = _databaseService.CreateConnection();
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@userId", userId);
        connection.Open();
        return (int)command.ExecuteScalar() > 0;
    }

    public void SetRole(int userId, string role, decimal? avgSpending, string? portfolio)
    {
        using var connection = _databaseService.CreateConnection();
        connection.Open();

        using var transaction = connection.BeginTransaction();
        try
        {
            DeleteRoleRows(connection, transaction, userId);
            UpdateUserRole(connection, transaction, userId, role);

            switch (role)
            {
                case "admin":
                    InsertAdmin(connection, transaction, userId);
                    break;
                case "client":
                    InsertClient(connection, transaction, userId, avgSpending ?? 0m);
                    break;
                case "freelancer":
                    InsertFreelancer(connection, transaction, userId, portfolio);
                    break;
            }

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    private static void UpdateUserRole(SqlConnection connection, SqlTransaction transaction, int userId, string role)
    {
        const string sql = "UPDATE USERS SET Role = @role WHERE User_ID = @userId;";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@role", role);
        command.Parameters.AddWithValue("@userId", userId);
        command.ExecuteNonQuery();
    }

    private static void DeleteRoleRows(SqlConnection connection, SqlTransaction transaction, int userId)
    {
        const string sql = @"
DELETE FROM ADMIN WHERE User_ID = @userId;
DELETE FROM CLIENT WHERE User_ID = @userId;
DELETE FROM FREELANCER WHERE User_ID = @userId;";

        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.ExecuteNonQuery();
    }

    private static void InsertAdmin(SqlConnection connection, SqlTransaction transaction, int userId)
    {
        const string sql = "INSERT INTO ADMIN (User_ID) VALUES (@userId);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.ExecuteNonQuery();
    }

    private static void InsertClient(SqlConnection connection, SqlTransaction transaction, int userId, decimal avgSpending)
    {
        const string sql = "INSERT INTO CLIENT (User_ID, Avg_Spending) VALUES (@userId, @avgSpending);";
        using var command = new SqlCommand(sql, connection, transaction);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@avgSpending", avgSpending);
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
}
