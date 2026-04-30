using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class ReviewRepository
{
    private readonly string _connectionString;

    public ReviewRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }

    public List<Review> GetAll()
    {
        var list = new List<Review>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Review
                        {
                        ReviewId = reader.GetInt32(0),
                        FlRating = reader.IsDBNull(1) ? null : reader.GetDecimal(1),
                        FlDescription = reader.IsDBNull(2) ? null : reader.GetString(2),
                        ClRating = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ClDescription = reader.IsDBNull(4) ? null : reader.GetString(4),
                        JobId = reader.GetInt32(5),
                        AdminId = reader.IsDBNull(6) ? null : reader.GetInt32(6)
                        });
                    }
                }
            }
        }
        return list;
    }

    public Review GetById(int id)
    {
        Review entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW WHERE Review_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new Review
                        {
                        ReviewId = reader.GetInt32(0),
                        FlRating = reader.IsDBNull(1) ? null : reader.GetDecimal(1),
                        FlDescription = reader.IsDBNull(2) ? null : reader.GetString(2),
                        ClRating = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ClDescription = reader.IsDBNull(4) ? null : reader.GetString(4),
                        JobId = reader.GetInt32(5),
                        AdminId = reader.IsDBNull(6) ? null : reader.GetInt32(6)
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(Review entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "INSERT INTO REVIEW (FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID) VALUES (@FlRating, @FlDescription, @ClRating, @ClDescription, @JobId, @AdminId); SELECT SCOPE_IDENTITY();";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);
                connection.Open();
                entity.ReviewId = Convert.ToInt32(command.ExecuteScalar());
            }
        }
    }

    public void Update(Review entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "UPDATE REVIEW SET FL_Rating = @FlRating, FL_Description = @FlDescription, CL_Rating = @ClRating, CL_Description = @ClDescription, Admin_ID = @AdminId WHERE Review_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", entity.ReviewId);
                command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(int id)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "DELETE FROM REVIEW WHERE Review_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
