const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'Models');
const reposDir = path.join(__dirname, 'backend', 'Repositories');
const controllersDir = path.join(__dirname, 'backend', 'Controllers');

const entities = [
    {
        name: 'Post',
        properties: `
    public int PostId { get; set; }
    public string JobDescription { get; set; }
    public string Status { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public string AvailCommHours { get; set; }
    public DateTime? ExpectedDeadline { get; set; }
    public int CreatedByClientId { get; set; }
    public int? AcceptedByAdminId { get; set; }
    public DateTime CreatedAt { get; set; }
`,
        repoSql: {
            getAll: `SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST`,
            getById: `SELECT Post_ID, Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID, Accepted_By_Admin_ID, Created_At FROM POST WHERE Post_ID = @Id`,
            insert: `INSERT INTO POST (Job_Description, Status, Price_Min, Price_Max, Avail_Comm_Hours, Expected_Deadline, Created_By_Client_ID) VALUES (@JobDescription, @Status, @PriceMin, @PriceMax, @AvailCommHours, @ExpectedDeadline, @CreatedByClientId); SELECT SCOPE_IDENTITY();`,
            update: `UPDATE POST SET Job_Description = @JobDescription, Status = @Status, Price_Min = @PriceMin, Price_Max = @PriceMax, Avail_Comm_Hours = @AvailCommHours, Expected_Deadline = @ExpectedDeadline, Accepted_By_Admin_ID = @AcceptedByAdminId WHERE Post_ID = @Id`,
            delete: `DELETE FROM POST WHERE Post_ID = @Id`
        },
        readRow: `
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
        `,
        parametersInsert: `
        command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
        command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@CreatedByClientId", entity.CreatedByClientId);
        `,
        parametersUpdate: `
        command.Parameters.AddWithValue("@Id", entity.PostId);
        command.Parameters.AddWithValue("@JobDescription", entity.JobDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
        command.Parameters.AddWithValue("@PriceMin", entity.PriceMin ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@PriceMax", entity.PriceMax ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ExpectedDeadline", entity.ExpectedDeadline ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AcceptedByAdminId", entity.AcceptedByAdminId ?? (object)DBNull.Value);
        `
    },
    {
        name: 'Proposal',
        properties: `
    public int ProposalId { get; set; }
    public string ProposalMessage { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public string ExpJobDuration { get; set; }
    public string AvailCommHours { get; set; }
    public int PostId { get; set; }
    public int FreelancerId { get; set; }
    public DateTime CreatedAt { get; set; }
`,
        repoSql: {
            getAll: `SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL`,
            getById: `SELECT Proposal_ID, Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID, Created_At FROM PROPOSAL WHERE Proposal_ID = @Id`,
            insert: `INSERT INTO PROPOSAL (Proposal_Message, Status, Price, Exp_Job_Duration, Avail_Comm_Hours, Post_ID, Freelancer_ID) VALUES (@ProposalMessage, @Status, @Price, @ExpJobDuration, @AvailCommHours, @PostId, @FreelancerId); SELECT SCOPE_IDENTITY();`,
            update: `UPDATE PROPOSAL SET Proposal_Message = @ProposalMessage, Status = @Status, Price = @Price, Exp_Job_Duration = @ExpJobDuration, Avail_Comm_Hours = @AvailCommHours WHERE Proposal_ID = @Id`,
            delete: `DELETE FROM PROPOSAL WHERE Proposal_ID = @Id`
        },
        readRow: `
        ProposalId = reader.GetInt32(0),
        ProposalMessage = reader.IsDBNull(1) ? null : reader.GetString(1),
        Status = reader.IsDBNull(2) ? null : reader.GetString(2),
        Price = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
        ExpJobDuration = reader.IsDBNull(4) ? null : reader.GetString(4),
        AvailCommHours = reader.IsDBNull(5) ? null : reader.GetString(5),
        PostId = reader.GetInt32(6),
        FreelancerId = reader.GetInt32(7),
        CreatedAt = reader.IsDBNull(8) ? DateTime.MinValue : reader.GetDateTime(8)
        `,
        parametersInsert: `
        command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
        command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@PostId", entity.PostId);
        command.Parameters.AddWithValue("@FreelancerId", entity.FreelancerId);
        `,
        parametersUpdate: `
        command.Parameters.AddWithValue("@Id", entity.ProposalId);
        command.Parameters.AddWithValue("@ProposalMessage", entity.ProposalMessage ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Status", entity.Status ?? "pending");
        command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ExpJobDuration", entity.ExpJobDuration ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AvailCommHours", entity.AvailCommHours ?? (object)DBNull.Value);
        `
    },
    {
        name: 'Job',
        properties: `
    public int JobId { get; set; }
    public string Status { get; set; }
    public decimal? Price { get; set; }
    public DateTime? ProjectDeadline { get; set; }
    public int? AcceptedProposalId { get; set; }
    public DateTime CreatedAt { get; set; }
`,
        repoSql: {
            getAll: `SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB`,
            getById: `SELECT Job_ID, Status, Price, Project_Deadline, Accepted_Proposal_ID, Created_At FROM JOB WHERE Job_ID = @Id`,
            insert: `INSERT INTO JOB (Status, Price, Project_Deadline, Accepted_Proposal_ID) VALUES (@Status, @Price, @ProjectDeadline, @AcceptedProposalId); SELECT SCOPE_IDENTITY();`,
            update: `UPDATE JOB SET Status = @Status, Price = @Price, Project_Deadline = @ProjectDeadline WHERE Job_ID = @Id`,
            delete: `DELETE FROM JOB WHERE Job_ID = @Id`
        },
        readRow: `
        JobId = reader.GetInt32(0),
        Status = reader.IsDBNull(1) ? null : reader.GetString(1),
        Price = reader.IsDBNull(2) ? null : reader.GetDecimal(2),
        ProjectDeadline = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
        AcceptedProposalId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
        CreatedAt = reader.IsDBNull(5) ? DateTime.MinValue : reader.GetDateTime(5)
        `,
        parametersInsert: `
        command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
        command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AcceptedProposalId", entity.AcceptedProposalId ?? (object)DBNull.Value);
        `,
        parametersUpdate: `
        command.Parameters.AddWithValue("@Id", entity.JobId);
        command.Parameters.AddWithValue("@Status", entity.Status ?? "in_progress");
        command.Parameters.AddWithValue("@Price", entity.Price ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ProjectDeadline", entity.ProjectDeadline ?? (object)DBNull.Value);
        `
    },
    {
        name: 'Deliverable',
        properties: `
    public int JobId { get; set; }
    public int Number { get; set; }
    public string Attachment { get; set; }
    public string Description { get; set; }
    public DateTime? Deadline { get; set; }
`,
        repoSql: {
            getAll: `SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE`,
            getById: `SELECT Job_ID, Number, Attachment, Description, Deadline FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number`,
            insert: `INSERT INTO DELIVERABLE (Job_ID, Number, Attachment, Description, Deadline) VALUES (@JobId, @Number, @Attachment, @Description, @Deadline);`,
            update: `UPDATE DELIVERABLE SET Attachment = @Attachment, Description = @Description, Deadline = @Deadline WHERE Job_ID = @JobId AND Number = @Number`,
            delete: `DELETE FROM DELIVERABLE WHERE Job_ID = @JobId AND Number = @Number`
        },
        readRow: `
        JobId = reader.GetInt32(0),
        Number = reader.GetInt32(1),
        Attachment = reader.IsDBNull(2) ? null : reader.GetString(2),
        Description = reader.IsDBNull(3) ? null : reader.GetString(3),
        Deadline = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
        `,
        parametersInsert: `
        command.Parameters.AddWithValue("@JobId", entity.JobId);
        command.Parameters.AddWithValue("@Number", entity.Number);
        command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);
        `,
        parametersUpdate: `
        command.Parameters.AddWithValue("@JobId", entity.JobId);
        command.Parameters.AddWithValue("@Number", entity.Number);
        command.Parameters.AddWithValue("@Attachment", entity.Attachment ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Description", entity.Description ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@Deadline", entity.Deadline ?? (object)DBNull.Value);
        `
    },
    {
        name: 'Review',
        properties: `
    public int ReviewId { get; set; }
    public decimal? FlRating { get; set; }
    public string FlDescription { get; set; }
    public decimal? ClRating { get; set; }
    public string ClDescription { get; set; }
    public int JobId { get; set; }
    public int? AdminId { get; set; }
`,
        repoSql: {
            getAll: `SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW`,
            getById: `SELECT Review_ID, FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID FROM REVIEW WHERE Review_ID = @Id`,
            insert: `INSERT INTO REVIEW (FL_Rating, FL_Description, CL_Rating, CL_Description, Job_ID, Admin_ID) VALUES (@FlRating, @FlDescription, @ClRating, @ClDescription, @JobId, @AdminId); SELECT SCOPE_IDENTITY();`,
            update: `UPDATE REVIEW SET FL_Rating = @FlRating, FL_Description = @FlDescription, CL_Rating = @ClRating, CL_Description = @ClDescription, Admin_ID = @AdminId WHERE Review_ID = @Id`,
            delete: `DELETE FROM REVIEW WHERE Review_ID = @Id`
        },
        readRow: `
        ReviewId = reader.GetInt32(0),
        FlRating = reader.IsDBNull(1) ? null : reader.GetDecimal(1),
        FlDescription = reader.IsDBNull(2) ? null : reader.GetString(2),
        ClRating = reader.IsDBNull(3) ? null : reader.GetDecimal(3),
        ClDescription = reader.IsDBNull(4) ? null : reader.GetString(4),
        JobId = reader.GetInt32(5),
        AdminId = reader.IsDBNull(6) ? null : reader.GetInt32(6)
        `,
        parametersInsert: `
        command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@JobId", entity.JobId);
        command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);
        `,
        parametersUpdate: `
        command.Parameters.AddWithValue("@Id", entity.ReviewId);
        command.Parameters.AddWithValue("@FlRating", entity.FlRating ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@FlDescription", entity.FlDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ClRating", entity.ClRating ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@ClDescription", entity.ClDescription ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@AdminId", entity.AdminId ?? (object)DBNull.Value);
        `
    }
];

entities.forEach(entity => {
    // Write Model
    const modelContent = \`using System;
namespace Stackra.Backend.Models;

public class \${entity.name}
{
\${entity.properties}
}\`;
    fs.mkdirSync(path.join(modelsDir, entity.name + 's'), { recursive: true });
    fs.writeFileSync(path.join(modelsDir, entity.name + 's', \`\${entity.name}.cs\`), modelContent);

    // Write Repo
    const isDeliverable = entity.name === 'Deliverable';
    const idType = isDeliverable ? 'int jobId, int number' : 'int id';
    const insertExec = isDeliverable ? 'command.ExecuteNonQuery();' : 'entity.' + entity.name + 'Id = Convert.ToInt32(command.ExecuteScalar());';
    const repoContent = \`using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class \${entity.name}Repository
{
    private readonly string _connectionString;

    public \${entity.name}Repository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        if (!string.IsNullOrEmpty(password))
        {
            _connectionString = baseString + "Password=" + password + ";";
        }
        else 
        {
            _connectionString = baseString; // For local integrated auth or default
        }
    }

    public List<\${entity.name}> GetAll()
    {
        var list = new List<\${entity.name}>();
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "\${entity.repoSql.getAll}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new \${entity.name}
                        {
\${entity.readRow}
                        });
                    }
                }
            }
        }
        return list;
    }

    public \${entity.name} GetById(\${idType})
    {
        \${entity.name} entity = null;
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "\${entity.repoSql.getById}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                \${isDeliverable ? 'command.Parameters.AddWithValue("@JobId", jobId); command.Parameters.AddWithValue("@Number", number);' : 'command.Parameters.AddWithValue("@Id", id);'}
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        entity = new \${entity.name}
                        {
\${entity.readRow}
                        };
                    }
                }
            }
        }
        return entity;
    }

    public void Insert(\${entity.name} entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "\${entity.repoSql.insert}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
\${entity.parametersInsert}
                connection.Open();
                \${insertExec}
            }
        }
    }

    public void Update(\${entity.name} entity)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "\${entity.repoSql.update}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
\${entity.parametersUpdate}
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }

    public void Delete(\${idType})
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            string sql = "\${entity.repoSql.delete}";
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                \${isDeliverable ? 'command.Parameters.AddWithValue("@JobId", jobId); command.Parameters.AddWithValue("@Number", number);' : 'command.Parameters.AddWithValue("@Id", id);'}
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}\`;
    fs.writeFileSync(path.join(reposDir, \`\${entity.name}Repository.cs\`), repoContent);

    // Write Controller
    const controllerContent = \`using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[\${entity.name.toLowerCase()}s]")]
public class \${entity.name}sController : ControllerBase
{
    private readonly \${entity.name}Repository _repository;

    public \${entity.name}sController(\${entity.name}Repository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_repository.GetAll());
    }

    \${isDeliverable ? 
    \`[HttpGet("{jobId}/{number}")]
    public IActionResult Get(int jobId, int number)
    {
        var entity = _repository.GetById(jobId, number);
        if (entity == null) return NotFound();
        return Ok(entity);
    }\` : 
    \`[HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var entity = _repository.GetById(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }\`}

    [HttpPost]
    public IActionResult Create([FromBody] \${entity.name} entity)
    {
        _repository.Insert(entity);
        return Ok(entity);
    }

    \${isDeliverable ? 
    \`[HttpPut("{jobId}/{number}")]
    public IActionResult Update(int jobId, int number, [FromBody] \${entity.name} entity)
    {
        entity.JobId = jobId;
        entity.Number = number;
        _repository.Update(entity);
        return Ok(entity);
    }\` : 
    \`[HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] \${entity.name} entity)
    {
        entity.\${entity.name}Id = id;
        _repository.Update(entity);
        return Ok(entity);
    }\`}

    \${isDeliverable ? 
    \`[HttpDelete("{jobId}/{number}")]
    public IActionResult Delete(int jobId, int number)
    {
        _repository.Delete(jobId, number);
        return NoContent();
    }\` : 
    \`[HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _repository.Delete(id);
        return NoContent();
    }\`}
}\`;
    fs.writeFileSync(path.join(controllersDir, \`\${entity.name}sController.cs\`), controllerContent);
});

// Update Program.cs
const programPath = path.join(__dirname, 'backend', 'Program.cs');
let program = fs.readFileSync(programPath, 'utf8');
const depsToInject = entities.map(e => \`builder.Services.AddScoped<Stackra.Backend.Repositories.\${e.name}Repository>();\`).join('\\n');
if (!program.includes('PostRepository')) {
    program = program.replace('builder.Services.AddScoped<Stackra.Backend.Repositories.UserRepository>();', 
    'builder.Services.AddScoped<Stackra.Backend.Repositories.UserRepository>();\\n' + depsToInject);
    fs.writeFileSync(programPath, program);
}

console.log("Backend generated successfully.");
