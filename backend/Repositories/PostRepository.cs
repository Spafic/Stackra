using Microsoft.Data.SqlClient;
using Stackra.Backend.Models.Posts;

namespace Stackra.Backend.Repositories;

public class PostRepository
{
    private readonly DatabaseService _db;

    public PostRepository(DatabaseService db)
    {
        _db = db;
    }

    public List<PostResponse> GetAllPosts()
    {
        var posts = new List<PostResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM POST ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) posts.Add(MapPost(reader));
        return posts;
    }

    public List<PostResponse> GetActivePosts()
    {
        var posts = new List<PostResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM POST WHERE Status = 'active' ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) posts.Add(MapPost(reader));
        return posts;
    }

    public List<PostResponse> GetPostsByClient(int clientId)
    {
        var posts = new List<PostResponse>();
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM POST WHERE Created_By_Client_ID = @ClientId ORDER BY Created_At DESC";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) posts.Add(MapPost(reader));
        return posts;
    }

    public PostResponse? GetPostById(int postId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT * FROM POST WHERE Post_ID = @PostId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapPost(reader) : null;
    }

    public int CreatePost(int clientId, PostCreateRequest request)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            INSERT INTO POST 
                (Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID)
            OUTPUT INSERTED.Post_ID
            VALUES 
                (@Desc, 'pending', @Min, @Max, @Hours, @Deadline, @ClientId)";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Desc", (object?)request.JobDescription ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Min", (object?)request.PriceMin ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Max", (object?)request.PriceMax ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Hours", (object?)request.AvailCommHours ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Deadline", (object?)request.ExpectedDeadline ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        return (int)cmd.ExecuteScalar()!;
    }

    public bool PostExists(int postId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT COUNT(1) FROM POST WHERE Post_ID = @PostId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public bool IsPostOwner(int postId, int clientId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "SELECT COUNT(1) FROM POST WHERE Post_ID = @PostId AND Created_By_Client_ID = @ClientId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        cmd.Parameters.AddWithValue("@ClientId", clientId);
        return (int)cmd.ExecuteScalar()! > 0;
    }

    public void UpdatePost(int postId, PostUpdateRequest request)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            UPDATE POST SET
                Job_Description   = @Desc,
                Price_Min         = @Min,
                Price_Max         = @Max,
                Avail_Comm_Hours  = @Hours,
                Expected_Deadline = @Deadline
            WHERE Post_ID = @PostId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Desc", (object?)request.JobDescription ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Min", (object?)request.PriceMin ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Max", (object?)request.PriceMax ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Hours", (object?)request.AvailCommHours ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Deadline", (object?)request.ExpectedDeadline ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PostId", postId);
        cmd.ExecuteNonQuery();
    }

    public void UpdatePostStatus(int postId, string status, int? adminId = null)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = @"
            UPDATE POST SET 
                Status = @Status,
                Accepted_By_Admin_ID = @AdminId
            WHERE Post_ID = @PostId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@Status", status);
        cmd.Parameters.AddWithValue("@AdminId", (object?)adminId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PostId", postId);
        cmd.ExecuteNonQuery();
    }

    public void DeletePost(int postId)
    {
        using var conn = _db.CreateConnection();
        conn.Open();
        var sql = "DELETE FROM POST WHERE Post_ID = @PostId";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@PostId", postId);
        cmd.ExecuteNonQuery();
    }

    private static PostResponse MapPost(SqlDataReader r) => new()
    {
        PostId             = r.GetInt32(r.GetOrdinal("Post_ID")),
        JobDescription     = r.IsDBNull(r.GetOrdinal("Job_Description")) ? null : r.GetString(r.GetOrdinal("Job_Description")),
        Status             = r.IsDBNull(r.GetOrdinal("Status")) ? null : r.GetString(r.GetOrdinal("Status")),
        PriceMin           = r.IsDBNull(r.GetOrdinal("Price_Min")) ? null : r.GetDecimal(r.GetOrdinal("Price_Min")),
        PriceMax           = r.IsDBNull(r.GetOrdinal("Price_Max")) ? null : r.GetDecimal(r.GetOrdinal("Price_Max")),
        AvailCommHours     = r.IsDBNull(r.GetOrdinal("Avail_Comm_Hours")) ? null : r.GetString(r.GetOrdinal("Avail_Comm_Hours")),
        ExpectedDeadline   = r.IsDBNull(r.GetOrdinal("Expected_Deadline")) ? null : r.GetDateTime(r.GetOrdinal("Expected_Deadline")),
        CreatedByClientId  = r.GetInt32(r.GetOrdinal("Created_By_Client_ID")),
        AcceptedByAdminId  = r.IsDBNull(r.GetOrdinal("Accepted_By_Admin_ID")) ? null : r.GetInt32(r.GetOrdinal("Accepted_By_Admin_ID")),
        CreatedAt          = r.GetDateTime(r.GetOrdinal("Created_At"))
    };
}