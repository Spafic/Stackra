using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class ProposalRepository
{
    private readonly string _connectionString;

    public ProposalRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }

    public List<Proposal> GetAll()
    {
        var list = new List<Proposal>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Proposal
                        {
                        ProposalId = reader.GetInt32(0),
                        ProposalMessage = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Price = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ExpJobDuration = reader.IsDBNull(4) ? null : reader.GetString(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        PostId = reader.GetInt32(6),
                        FreelancerId = reader.GetInt32(7),
                        CreatedAt = reader.IsDBNull(8) ? DateTime.MinValue : reader.GetDateTime(8)
                        });
                    }
                }
            }
        }
        return list;
    }

    public Proposal GetById(int id)
    {
        Proposal entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL WHERE Proposal_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new Proposal
                        {
                        ProposalId = reader.GetInt32(0),
                        ProposalMessage = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Price = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ExpJobDuration = reader.IsDBNull(4) ? null : reader.GetString(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        PostId = reader.GetInt32(6),
                        FreelancerId = reader.GetInt32(7),
                        CreatedAt = reader.IsDBNull(8) ? DateTime.MinValue : reader.GetDateTime(8)
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(Proposal entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "INSERT INTO PROPOSAL (Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID) VALUES (@ProposalMessage, @Status, @Price, @ExpJobDuration, @AvailCommHours, @PostId, @FreelancerId); SELECT SCOPE_IDENTITY();";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PostId", entity.PostId);
                command.Parameters.AddWithValue("@FreelancerId", entity.FreelancerId);
                connection.Open();
                entity.ProposalId = Convert.ToInt32(command.ExecuteScalar());
            }
        }
    }

    public void Update(Proposal entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "UPDATE PROPOSAL SET Proposal_Message = @ProposalMessage, Status = @Status, Price = @Price, Exp_Job_Duration = @ExpJobDuration, Avail_Comm_Hours = @AvailCommHours WHERE Proposal_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", entity.ProposalId);
                command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(int id)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "DELETE FROM PROPOSAL WHERE Proposal_ID = @Id";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("@Id", id);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
