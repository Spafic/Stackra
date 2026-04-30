using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class PostRepository
{
    private readonly string _connectionString;

    public PostRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }

    public List<Post> GetAll()
    {
        var list = new List<Post>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Post
                        {
                        PostId = reader.GetInt32(0),
                        JobDescription = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        PriceMin = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        PriceMax = reader.IsDBNull(4) ? null : reader.GetDecimal(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        ExpectedDeadline = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                        CreatedByClientId = reader.GetInt32(7),
                        AcceptedByAdminId = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                        CreatedAt = reader.IsDBNull(9) ? DateTime.MinValue : reader.GetDateTime(9)
                        });
                    }
                }
            }
        }
        return list;
    }

    public Post GetById(int id)
    {
        Post entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST WHERE Post_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new Post
                        {
                        PostId = reader.GetInt32(0),
                        JobDescription = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        PriceMin = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        PriceMax = reader.IsDBNull(4) ? null : reader.GetDecimal(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        ExpectedDeadline = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                        CreatedByClientId = reader.GetInt32(7),
                        AcceptedByAdminId = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                        CreatedAt = reader.IsDBNull(9) ? DateTime.MinValue : reader.GetDateTime(9)
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(Post entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "INSERT INTO POST (Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID) VALUES (@JobDescription, @Status, @PriceMin, @PriceMax, @AvailCommHours, @ExpectedDeadline, @CreatedByClientId); SELECT SCOPE_IDENTITY();";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@CreatedByClientId", entity.CreatedByClientId);
                connection.Open();
                entity.PostId = Convert.ToInt32(command.ExecuteScalar());
            }
        }
    }

    public void Update(Post entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "UPDATE POST SET Job_Description = @JobDescription, Status = @Status, Price_Min = @PriceMin, Price_Max = @PriceMax, Avail_Comm_Hours = @AvailCommHours, Expected_Deadline = @ExpectedDeadline, Accepted_By_Admin_ID = @AcceptedByAdminId WHERE Post_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", entity.PostId);
                command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AcceptedByAdminId", entity.AcceptedByAdminId ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(int id)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "DELETE FROM POST WHERE Post_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
