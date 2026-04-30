using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class JobRepository
{
    private readonly string _connectionString;

    public JobRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }

    public List<Job> GetAll()
    {
        var list = new List<Job>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Job
                        {
                        JobId = reader.GetInt32(0),
                        Status = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Price = reader.IsDBNull(2) ? null : reader.GetDecimal(2),
                        ProjectDeadline = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                        AcceptedProposalId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                        CreatedAt = reader.IsDBNull(5) ? DateTime.MinValue : reader.GetDateTime(5)
                        });
                    }
                }
            }
        }
        return list;
    }

    public Job GetById(int id)
    {
        Job entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB WHERE Job_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new Job
                        {
                        JobId = reader.GetInt32(0),
                        Status = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Price = reader.IsDBNull(2) ? null : reader.GetDecimal(2),
                        ProjectDeadline = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                        AcceptedProposalId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                        CreatedAt = reader.IsDBNull(5) ? DateTime.MinValue : reader.GetDateTime(5)
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(Job entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "INSERT INTO JOB (Status, Price, Project_Deadline, Accepted_Proposal_ID) VALUES (@Status, @Price, @ProjectDeadline, @AcceptedProposalId); SELECT SCOPE_IDENTITY();";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AcceptedProposalId", entity.AcceptedProposalId ?? (object)DBNull.Value);
                connection.Open();
                entity.JobId = Convert.ToInt32(command.ExecuteScalar());
            }
        }
    }

    public void Update(Job entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "UPDATE JOB SET Status = @Status, Price = @Price, Project_Deadline = @ProjectDeadline WHERE Job_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", entity.JobId);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(int id)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "DELETE FROM JOB WHERE Job_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
