using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Proposals;

namespace Stackra.Backend.Repositories;

public class ProposalRepository
{
    private readonly DatabaseService _db;

    public ProposalRepository(DatabaseService db)
    {
        _db = db;
    }

    public List<ProposalResponse> GetProposalsByPost(int postId)
    {
        var list = new List<ProposalResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM PROPOSAL WHERE Post_ID = @PostId ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapProposal(reader));
        return list;
    }

    public List<ProposalResponse> GetProposalsByFreelancer(int freelancerId)
    {
        var list = new List<ProposalResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM PROPOSAL WHERE Freelancer_ID = @FreelancerId ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapProposal(reader));
        return list;
    }

    public ProposalResponse? GetProposalById(int proposalId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM PROPOSAL WHERE Proposal_ID = @ProposalId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@ProposalId", proposalId);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapProposal(reader) : null;
    }

    public bool AlreadySubmitted(int postId, int freelancerId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT COUNT(1) FROM PROPOSAL WHERE Post_ID = @PostId AND Freelancer_ID = @FreelancerId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public bool IsProposalOwner(int proposalId, int freelancerId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT COUNT(1) FROM PROPOSAL WHERE Proposal_ID = @ProposalId AND Freelancer_ID = @FreelancerId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@ProposalId", proposalId);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public int CreateProposal(int freelancerId, ProposalCreateRequest request)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            INSERT INTO PROPOSAL 
                (Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID)
            OUTPUT INSERTED.Proposal_ID
            VALUES 
                (@Msg, 'pending', @Price, @Duration, @Hours, @PostId, @FreelancerId)";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Msg", (object?)request.ProposalMessage ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Price", (object?)request.Price ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Duration", (object?)request.ExpJobDuration ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Hours", (object?)request.AvailCommHours ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PostId", request.PostId);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        return (int)cmd.ExecuteScalar()!;
    }

    public void UpdateProposalStatus(int proposalId, string status)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "UPDATE PROPOSAL SET Status = @Status WHERE Proposal_ID = @ProposalId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Status", status);
        cmd.Parameters.AddWithValue("@ProposalId", proposalId);
        cmd.ExecuteNonQuery();
    }

    public void DeleteProposal(int proposalId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "DELETE FROM PROPOSAL WHERE Proposal_ID = @ProposalId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@ProposalId", proposalId);
        cmd.ExecuteNonQuery();
    }

    private static ProposalResponse MapProposal(SqlDataReader r) => new()
    {
        ProposalId      = r.GetInt32(r.GetOrdinal("Proposal_ID")),
        ProposalMessage = r.IsDBNull(r.GetOrdinal("Proposal_Message")) ? null : r.GetString(r.GetOrdinal("Proposal_Message")),
        Status          = r.IsDBNull(r.GetOrdinal("Status")) ? null : r.GetString(r.GetOrdinal("Status")),
        Price           = r.IsDBNull(r.GetOrdinal("Price")) ? null : r.GetDecimal(r.GetOrdinal("Price")),
        ExpJobDuration  = r.IsDBNull(r.GetOrdinal("Exp_Job_Duration")) ? null : r.GetString(r.GetOrdinal("Exp_Job_Duration")),
        AvailCommHours  = r.IsDBNull(r.GetOrdinal("Avail_Comm_Hours")) ? null : r.GetString(r.GetOrdinal("Avail_Comm_Hours")),
        PostId          = r.GetInt32(r.GetOrdinal("Post_ID")),
        FreelancerId    = r.GetInt32(r.GetOrdinal("Freelancer_ID")),
        CreatedAt       = r.GetDateTime(r.GetOrdinal("Created_At"))
    };
}