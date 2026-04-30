using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Jobs;

namespace Stackra.Backend.Repositories;

public class JobRepository
{
    private readonly DatabaseService _db;

    public JobRepository(DatabaseService db)
    {
        _db = db;
    }

    public JobResponse? GetJobById(int jobId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM JOB WHERE Job_ID = @JobId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapJob(reader) : null;
    }

    public List<JobResponse> GetAllJobs()
    {
        var list = new List<JobResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM JOB ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapJob(reader));
        return list;
    }

    public List<JobResponse> GetJobsByFreelancer(int freelancerId)
    {
        var list = new List<JobResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            SELECT j.* FROM JOB j
            JOIN PROPOSAL p ON j.Accepted_Proposal_ID = p.Proposal_ID
            WHERE p.Freelancer_ID = @FreelancerId
            ORDER BY j.Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapJob(reader));
        return list;
    }

    public List<JobResponse> GetJobsByClient(int clientId)
    {
        var list = new List<JobResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            SELECT j.* FROM JOB j
            JOIN PROPOSAL p ON j.Accepted_Proposal_ID = p.Proposal_ID
            JOIN POST po ON p.Post_ID = po.Post_ID
            WHERE po.Created_By_Client_ID = @ClientId
            ORDER BY j.Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapJob(reader));
        return list;
    }

    public int CreateJob(int proposalId, decimal? price, DateTime? deadline)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            INSERT INTO JOB (Status, Price, Project_Deadline, Accepted_Proposal_ID)
            OUTPUT INSERTED.Job_ID
            VALUES ('in_progress', @Price, @Deadline, @ProposalId)";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Price", (object?)price ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Deadline", (object?)deadline ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@ProposalId", proposalId);
        return (int)cmd.ExecuteScalar()!;
    }

    public bool JobExists(int jobId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT COUNT(1) FROM JOB WHERE Job_ID = @JobId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public void UpdateJob(int jobId, JobUpdateRequest request)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            UPDATE JOB SET
                Status           = @Status,
                Project_Deadline = @Deadline
            WHERE Job_ID = @JobId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Status", (object?)request.Status ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Deadline", (object?)request.ProjectDeadline ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.ExecuteNonQuery();
    }

    public List<DeliverableResponse> GetDeliverables(int jobId)
    {
        var list = new List<DeliverableResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM DELIVERABLE WHERE Job_ID = @JobId ORDER BY Number";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) list.Add(MapDeliverable(reader));
        return list;
    }

    public DeliverableResponse? GetDeliverable(int jobId, int number)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.Parameters.AddWithValue("@Number", number);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapDeliverable(reader) : null;
    }

    public int GetNextDeliverableNumber(int jobId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT ISNULL(MAX(Number), 0) + 1 FROM DELIVERABLE WHERE Job_ID = @JobId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        return (int)cmd.ExecuteScalar()!;
    }

    public void AddDeliverable(int jobId, int number, DeliverableRequest request)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            INSERT INTO DELIVERABLE (Job_ID, Number, Attachment, Description, Deadline)
            VALUES (@JobId, @Number, @Attachment, @Desc, @Deadline)";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.Parameters.AddWithValue("@Number", number);
        cmd.Parameters.AddWithValue("@Attachment", (object?)request.Attachment ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Desc", (object?)request.Description ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Deadline", (object?)request.Deadline ?? DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void DeleteDeliverable(int jobId, int number)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "DELETE FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.Parameters.AddWithValue("@Number", number);
        cmd.ExecuteNonQuery();
    }

    public bool IsJobFreelancer(int jobId, int freelancerId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            SELECT COUNT(1) FROM JOB j
            JOIN PROPOSAL p ON j.Accepted_Proposal_ID = p.Proposal_ID
            WHERE j.Job_ID = @JobId AND p.Freelancer_ID = @FreelancerId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.Parameters.AddWithValue("@FreelancerId", freelancerId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public bool IsJobClient(int jobId, int clientId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            SELECT COUNT(1) FROM JOB j
            JOIN PROPOSAL p ON j.Accepted_Proposal_ID = p.Proposal_ID
            JOIN POST po ON p.Post_ID = po.Post_ID
            WHERE j.Job_ID = @JobId AND po.Created_By_Client_ID = @ClientId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@JobId", jobId);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    private static JobResponse MapJob(SqlDataReader r) => new()
    {
        JobId              = r.GetInt32(r.GetOrdinal("Job_ID")),
        Status             = r.IsDBNull(r.GetOrdinal("Status")) ? null : r.GetString(r.GetOrdinal("Status")),
        Price              = r.IsDBNull(r.GetOrdinal("Price")) ? null : r.GetDecimal(r.GetOrdinal("Price")),
        ProjectDeadline    = r.IsDBNull(r.GetOrdinal("Project_Deadline")) ? null : r.GetDateTime(r.GetOrdinal("Project_Deadline")),
        AcceptedProposalId = r.IsDBNull(r.GetOrdinal("Accepted_Proposal_ID")) ? null : r.GetInt32(r.GetOrdinal("Accepted_Proposal_ID")),
        CreatedAt          = r.GetDateTime(r.GetOrdinal("Created_At"))
    };

    private static DeliverableResponse MapDeliverable(SqlDataReader r) => new()
    {
        JobId       = r.GetInt32(r.GetOrdinal("Job_ID")),
        Number      = r.GetInt32(r.GetOrdinal("Number")),
        Attachment  = r.IsDBNull(r.GetOrdinal("Attachment")) ? null : r.GetString(r.GetOrdinal("Attachment")),
        Description = r.IsDBNull(r.GetOrdinal("Description")) ? null : r.GetString(r.GetOrdinal("Description")),
        Deadline    = r.IsDBNull(r.GetOrdinal("Deadline")) ? null : r.GetDateTime(r.GetOrdinal("Deadline"))
    };
}