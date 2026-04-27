# API Development Guide (C# & ADO.NET)

Since we are moving away from Python/FastAPI, this guide explains exactly **where** and **how** you should write new API endpoints and database logic in our new .NET backend.

We are using a strict **Repository Pattern**. This means we separate our Database Code (SQL) from our API Code (HTTP).

## 1. Where do things go?

Inside the `Stackra.Backend` folder, you will see three main folders you need to care about:

1. `Models/` - Put your C# Classes here (These represent your database tables).
2. `Repositories/` - Put your ADO.NET SQL queries here (e.g., `SELECT`, `INSERT`).
3. `Controllers/` - Put your API routes here (e.g., `GET /api/users`, `POST /api/posts`).

---

## 2. How to create a new API (Step-by-Step)

Let's say you want to create an API that gets a User by their ID.

### Step 1: Create the Model
Create a plain C# class in the `Models` folder that matches your SQL Table columns.

**File:** `Stackra.Backend/Models/User.cs`
```csharp
namespace Stackra.Backend.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
}
```

### Step 2: Create the Repository (The Database Logic)
This is where you write your **raw SQL queries** using ADO.NET. 
*Rule: Controllers should NEVER contain SQL strings.*

**File:** `Stackra.Backend/Repositories/UserRepository.cs`
```csharp
using Microsoft.Data.SqlClient;
using Stackra.Backend.Models;

namespace Stackra.Backend.Repositories;

public class UserRepository
{
    private readonly string _connectionString;

    // We inject configuration to get the DB password from .env!
    public UserRepository(IConfiguration configuration)
    {
        var baseString = configuration.GetConnectionString("DefaultConnection");
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
        _connectionString = $"{baseString}Password={password};";
    }

    public User GetUserById(int id)
    {
        User user = null;

        // 1. Create Connection
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            // 2. Write SQL Query
            string sql = "SELECT Id, Username, Email FROM Users WHERE Id = @Id";
            
            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                // ALWAYS use parameters to prevent SQL injection!
                command.Parameters.AddWithValue("@Id", id);

                connection.Open();
                
                // 3. Execute and read data
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        user = new User
                        {
                            Id = reader.GetInt32(0),
                            Username = reader.GetString(1),
                            Email = reader.GetString(2)
                        };
                    }
                }
            }
        }
        return user;
    }
}
```

### Step 3: Register the Repository (CRITICAL)
Whenever you create a new Repository, you **must** tell .NET about it so it can be injected into your controllers. 

Open `Stackra.Backend/Program.cs` and add this line:
```csharp
// Add this under builder.Services.AddControllers();
builder.Services.AddScoped<Stackra.Backend.Repositories.UserRepository>();
```

### Step 4: Create the API Controller (The Routes)
This replaces FastAPI routers. Controllers handle the HTTP requests, call the Repository, and return JSON responses.

**File:** `Stackra.Backend/Controllers/UsersController.cs`
```csharp
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")] // This makes the route /api/users
public class UsersController : ControllerBase
{
    private readonly UserRepository _userRepository;

    // The repository is injected here automatically
    public UsersController(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // This handles GET /api/users/{id}
    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        // Call the database logic
        var user = _userRepository.GetUserById(id);
        
        if (user == null)
            return NotFound(new { message = "User not found" });

        // Returns HTTP 200 OK with the User JSON
        return Ok(user);
    }
}
```

---

## 3. Quick Summary of Rules
1. **Never write SQL in Controllers.** Always put it in a Repository.
2. **Never hardcode connection strings.** Always use `_connectionString` built from `IConfiguration` and `Environment`.
3. **Always use parameterized queries (`@ParamName`)**. Never use string concatenation (`$"{id}"`) in SQL. It causes SQL injection vulnerabilities.
4. **Always use `using` statements** for `SqlConnection`, `SqlCommand`, and `SqlDataReader` to prevent database connection memory leaks.
