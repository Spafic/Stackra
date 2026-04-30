using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class DeliverableRepository
{
    private readonly string _connectionString;

    public DeliverableRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }

    public List<Deliverable> GetAll()
    {
        var list = new List<Deliverable>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Deliverable
                        {
                        JobId = reader.GetInt32(0),
                        Number = reader.GetInt32(1),
                        Attachment = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                        Deadline = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
                        });
                    }
                }
            }
        }
        return list;
    }

    public Deliverable GetById(int jobId, int number)
    {
        Deliverable entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@JobId", jobId);
                command.Parameters.AddWithValue("@Number", number);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new Deliverable
                        {
                        JobId = reader.GetInt32(0),
                        Number = reader.GetInt32(1),
                        Attachment = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                        Deadline = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(Deliverable entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "INSERT INTO DELIVERABLE (Job_ID, Number, Attachment, Description, Deadline) VALUES (@JobId, @Number, @Attachment, @Description, @Deadline);";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@Number", entity.Number);
                command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Update(Deliverable entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "UPDATE DELIVERABLE SET Attachment = @Attachment, Description = @Description, Deadline = @Deadline WHERE Job_ID = @JobId AND Number = @Number";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@Number", entity.Number);
                command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(int jobId, int number)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "DELETE FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@JobId", jobId);
                command.Parameters.AddWithValue("@Number", number);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
