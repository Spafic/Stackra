import os

entities = [
    {
        "name": "Post",
        "properties": """    public int PostId { get; set; }
    public string JobDescription { get; set; }
    public string Status { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public string AvailCommHours { get; set; }
    public DateTime? ExpectedDeadline { get; set; }
    public int CreatedByClientId { get; set; }
    public int? AcceptedByAdminId { get; set; }
    public DateTime CreatedAt { get; set; }""",
        "repoSql": {
            "getAll": "SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST",
            "getById": "SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST WHERE Post_ID = @Id",
            "insert": "INSERT INTO POST (Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID) VALUES (@JobDescription, @Status, @PriceMin, @PriceMax, @AvailCommHours, @ExpectedDeadline, @CreatedByClientId); SELECT SCOPE_IDENTITY();",
            "update": "UPDATE POST SET Job_Description = @JobDescription, Status = @Status, Price_Min = @PriceMin, Price_Max = @PriceMax, Avail_Comm_Hours = @AvailCommHours, Expected_Deadline = @ExpectedDeadline, Accepted_By_Admin_ID = @AcceptedByAdminId WHERE Post_ID = @Id",
            "delete": "DELETE FROM POST WHERE Post_ID = @Id"
        },
        "readRow": """                        PostId = reader.GetInt32(0),
                        JobDescription = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        PriceMin = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        PriceMax = reader.IsDBNull(4) ? null : reader.GetDecimal(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        ExpectedDeadline = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                        CreatedByClientId = reader.GetInt32(7),
                        AcceptedByAdminId = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                        CreatedAt = reader.IsDBNull(9) ? DateTime.MinValue : reader.GetDateTime(9)""",
        "parametersInsert": """                command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@CreatedByClientId", entity.CreatedByClientId);""",
        "parametersUpdate": """                command.Parameters.AddWithValue("@Id", entity.PostId);
                command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AcceptedByAdminId", entity.AcceptedByAdminId ?? (object)DBNull.Value);"""
    },
    {
        "name": "Proposal",
        "properties": """    public int ProposalId { get; set; }
    public string ProposalMessage { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public string ExpJobDuration { get; set; }
    public string AvailCommHours { get; set; }
    public int PostId { get; set; }
    public int FreelancerId { get; set; }
    public DateTime CreatedAt { get; set; }""",
        "repoSql": {
            "getAll": "SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL",
            "getById": "SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL WHERE Proposal_ID = @Id",
            "insert": "INSERT INTO PROPOSAL (Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID) VALUES (@ProposalMessage, @Status, @Price, @ExpJobDuration, @AvailCommHours, @PostId, @FreelancerId); SELECT SCOPE_IDENTITY();",
            "update": "UPDATE PROPOSAL SET Proposal_Message = @ProposalMessage, Status = @Status, Price = @Price, Exp_Job_Duration = @ExpJobDuration, Avail_Comm_Hours = @AvailCommHours WHERE Proposal_ID = @Id",
            "delete": "DELETE FROM PROPOSAL WHERE Proposal_ID = @Id"
        },
        "readRow": """                        ProposalId = reader.GetInt32(0),
                        ProposalMessage = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Price = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ExpJobDuration = reader.IsDBNull(4) ? null : reader.GetString(4),
                        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
                        PostId = reader.GetInt32(6),
                        FreelancerId = reader.GetInt32(7),
                        CreatedAt = reader.IsDBNull(8) ? DateTime.MinValue : reader.GetDateTime(8)""",
        "parametersInsert": """                command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@PostId", entity.PostId);
                command.Parameters.AddWithValue("@FreelancerId", entity.FreelancerId);""",
        "parametersUpdate": """                command.Parameters.AddWithValue("@Id", entity.ProposalId);
                command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);"""
    },
    {
        "name": "Job",
        "properties": """    public int JobId { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public DateTime? ProjectDeadline { get; set; }
    public int? AcceptedProposalId { get; set; }
    public DateTime CreatedAt { get; set; }""",
        "repoSql": {
            "getAll": "SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB",
            "getById": "SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB WHERE Job_ID = @Id",
            "insert": "INSERT INTO JOB (Status, Price, Project_Deadline, Accepted_Proposal_ID) VALUES (@Status, @Price, @ProjectDeadline, @AcceptedProposalId); SELECT SCOPE_IDENTITY();",
            "update": "UPDATE JOB SET Status = @Status, Price = @Price, Project_Deadline = @ProjectDeadline WHERE Job_ID = @Id",
            "delete": "DELETE FROM JOB WHERE Job_ID = @Id"
        },
        "readRow": """                        JobId = reader.GetInt32(0),
                        Status = reader.IsDBNull(1) ? null : reader.GetString(1),
                        Price = reader.IsDBNull(2) ? null : reader.GetDecimal(2),
                        ProjectDeadline = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                        AcceptedProposalId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                        CreatedAt = reader.IsDBNull(5) ? DateTime.MinValue : reader.GetDateTime(5)""",
        "parametersInsert": """                command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AcceptedProposalId", entity.AcceptedProposalId ?? (object)DBNull.Value);""",
        "parametersUpdate": """                command.Parameters.AddWithValue("@Id", entity.JobId);
                command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
                command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);"""
    },
    {
        "name": "Deliverable",
        "properties": """    public int JobId { get; set; }
    public int Number { get; set; }
    public string Attachment { get; set; }
    public string Description { get; set; }
    public DateTime? Deadline { get; set; }""",
        "repoSql": {
            "getAll": "SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE",
            "getById": "SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number",
            "insert": "INSERT INTO DELIVERABLE (Job_ID, Number, Attachment, Description, Deadline) VALUES (@JobId, @Number, @Attachment, @Description, @Deadline);",
            "update": "UPDATE DELIVERABLE SET Attachment = @Attachment, Description = @Description, Deadline = @Deadline WHERE Job_ID = @JobId AND Number = @Number",
            "delete": "DELETE FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number"
        },
        "readRow": """                        JobId = reader.GetInt32(0),
                        Number = reader.GetInt32(1),
                        Attachment = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                        Deadline = reader.IsDBNull(4) ? null : reader.GetDateTime(4)""",
        "parametersInsert": """                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@Number", entity.Number);
                command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);""",
        "parametersUpdate": """                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@Number", entity.Number);
                command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);"""
    },
    {
        "name": "Review",
        "properties": """    public int ReviewId { get; set; }
    public decimal? FlRating { get; set; }
    public string FlDescription { get; set; }
    public decimal? ClRating { get; set; }
    public string ClDescription { get; set; }
    public int JobId { get; set; }
    public int? AdminId { get; set; }""",
        "repoSql": {
            "getAll": "SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW",
            "getById": "SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW WHERE Review_ID = @Id",
            "insert": "INSERT INTO REVIEW (FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID) VALUES (@FlRating, @FlDescription, @ClRating, @ClDescription, @JobId, @AdminId); SELECT SCOPE_IDENTITY();",
            "update": "UPDATE REVIEW SET FL_Rating = @FlRating, FL_Description = @FlDescription, CL_Rating = @ClRating, CL_Description = @ClDescription, Admin_ID = @AdminId WHERE Review_ID = @Id",
            "delete": "DELETE FROM REVIEW WHERE Review_ID = @Id"
        },
        "readRow": """                        ReviewId = reader.GetInt32(0),
                        FlRating = reader.IsDBNull(1) ? null : reader.GetDecimal(1),
                        FlDescription = reader.IsDBNull(2) ? null : reader.GetString(2),
                        ClRating = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
                        ClDescription = reader.IsDBNull(4) ? null : reader.GetString(4),
                        JobId = reader.GetInt32(5),
                        AdminId = reader.IsDBNull(6) ? null : reader.GetInt32(6)""",
        "parametersInsert": """                command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@JobId", entity.JobId);
                command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);""",
        "parametersUpdate": """                command.Parameters.AddWithValue("@Id", entity.ReviewId);
                command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);"""
    }
]

models_dir = os.path.join("backend", "Models")
repos_dir = os.path.join("backend", "Repositories")
controllers_dir = os.path.join("backend", "Controllers")

for e in entities:
    name = e["name"]
    is_deliv = name == "Deliverable"
    id_type = "int jobId, int number" if is_deliv else "int id"
    insert_exec = "command.ExecuteNonQuery();" if is_deliv else f"entity.{name}Id = Convert.ToInt32(command.ExecuteScalar());"
    
    # Model
    model_content = f"""using System;

namespace Stackra.Backend.Models;

public class {name}
{{
{e['properties']}
}}
"""
    model_folder = os.path.join(models_dir, f"{name}s")
    os.makedirs(model_folder, exist_ok=True)
    with open(os.path.join(model_folder, f"{name}.cs"), "w") as f:
        f.write(model_content)

    # Repository
    param_add = 'command.Parameters.AddWithValue("@JobId", jobId);\n                command.Parameters.AddWithValue("@Number", number);' if is_deliv else 'command.Parameters.AddWithValue("@Id", id);'
    repo_content = f"""using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class {name}Repository
{{
    private readonly string _connectionString;

    public {name}Repository(IConfiguration configuration)
    {{
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
            _connectionString = baseString + "Password=" + password + ";";
        else
            _connectionString = baseString;
    }}

    public List<{name}> GetAll()
    {{
        var list = new List<{name}>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {{
            string sql = "{e['repoSql']['getAll']}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {{
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {{
                    while (reader.Read())
                    {{
                        list.Add(new {name}
                        {{
{e['readRow']}
                        }});
                    }}
                }}
            }}
        }}
        return list;
    }}

    public {name} GetById({id_type})
    {{
        {name} entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {{
            string sql = "{e['repoSql']['getById']}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {{
                {param_add}
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {{
                    if (reader.Read())
                    {{
                        entity = new {name}
                        {{
{e['readRow']}
                        }};
                    }}
                }}
            }}
        }}
        return entity;
    }}

    public void Insert({name} entity)
    {{
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {{
            string sql = "{e['repoSql']['insert']}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {{
{e['parametersInsert']}
                connection.Open();
                {insert_exec}
            }}
        }}
    }}

    public void Update({name} entity)
    {{
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {{
            string sql = "{e['repoSql']['update']}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {{
{e['parametersUpdate']}
                connection.Open();
                command.ExecuteNonQuery();
            }}
        }}
    }}

    public void Delete({id_type})
    {{
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {{
            string sql = "{e['repoSql']['delete']}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {{
                {param_add}
                connection.Open();
                command.ExecuteNonQuery();
            }}
        }}
    }}
}}
"""
    with open(os.path.join(repos_dir, f"{name}Repository.cs"), "w") as f:
        f.write(repo_content)

    # Controller
    get_str = f"""    [HttpGet("{{jobId}}/{{number}}")]
    public IActionResult Get(int jobId, int number)
    {{
        var entity = _repository.GetById(jobId, number);
        if (entity == null) return NotFound();
        return Ok(entity);
    }}""" if is_deliv else f"""    [HttpGet("{{id}}")]
    public IActionResult Get(int id)
    {{
        var entity = _repository.GetById(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }}"""
    
    put_str = f"""    [HttpPut("{{jobId}}/{{number}}")]
    public IActionResult Update(int jobId, int number, [FromBody] {name} entity)
    {{
        entity.JobId = jobId;
        entity.Number = number;
        _repository.Update(entity);
        return Ok(entity);
    }}""" if is_deliv else f"""    [HttpPut("{{id}}")]
    public IActionResult Update(int id, [FromBody] {name} entity)
    {{
        entity.{name}Id = id;
        _repository.Update(entity);
        return Ok(entity);
    }}"""

    del_str = f"""    [HttpDelete("{{jobId}}/{{number}}")]
    public IActionResult Delete(int jobId, int number)
    {{
        _repository.Delete(jobId, number);
        return NoContent();
    }}""" if is_deliv else f"""    [HttpDelete("{{id}}")]
    public IActionResult Delete(int id)
    {{
        _repository.Delete(id);
        return NoContent();
    }}"""

    ctrl_content = f"""using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class {name}sController : ControllerBase
{{
    private readonly {name}Repository _repository;

    public {name}sController({name}Repository repository)
    {{
        _repository = repository;
    }}

    [HttpGet]
    public IActionResult GetAll()
    {{
        return Ok(_repository.GetAll());
    }}

{get_str}

    [HttpPost]
    public IActionResult Create([FromBody] {name} entity)
    {{
        _repository.Insert(entity);
        return Ok(entity);
    }}

{put_str}

{del_str}
}}
"""
    with open(os.path.join(controllers_dir, f"{name}sController.cs"), "w") as f:
        f.write(ctrl_content)

program_path = os.path.join("backend", "Program.cs")
with open(program_path, "r") as f:
    prog = f.read()

inject = "\\n".join([f"builder.Services.AddScoped<Stackra.Backend.Repositories.{e['name']}Repository>();" for e in entities])
if "PostRepository" not in prog:
    prog = prog.replace("builder.Services.AddScoped<Stackra.Backend.Repositories.UserRepository>();", 
        "builder.Services.AddScoped<Stackra.Backend.Repositories.UserRepository>();\\n" + inject)
    with open(program_path, "w") as f:
        f.write(prog)

print("Generated successfully!")
