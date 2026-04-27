using Microsoft.Data.SqlClient;

namespace Stackra.Backend.Repositories;

public class DatabaseService
{
    private readonly string _connectionString;

    // The IConfiguration interface is automatically provided by ASP.NET Core
    // and allows us to read from appsettings.json
    public DatabaseService(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        _connectionString = $"{baseString}Password={password};";
    }

    // This method demonstrates the exact ADO.NET pattern from the guide
    public string TestConnection()
    {
        string resultMessage = "Failed to connect.";

        // 1. Create a SqlConnection with the connection string
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            // 2. Open the connection
            connection.Open();

            // 3. Create a SqlCommand with your SQL query
            string sql = "SELECT 'ADO.NET Connection is working perfectly!' AS Message";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                // 4. (No parameters needed for this simple test)
                
                // 5. Execute the command and read the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        // GetString(0) reads the first column of the first row
                        resultMessage = reader.GetString(0);
                    }
                }
            }
        } // The 'using' block automatically closes the connection here

        return resultMessage;
    }
}
