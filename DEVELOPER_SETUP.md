# Developer Setup Guide (.NET & Docker)

Welcome to the new .NET backend! Follow these steps to get your local environment running after you pull the latest code.

## 1. Prerequisites (Required Tooling)
Before you start, ensure you have the required .NET tooling installed:
1. **.NET 8 SDK**: [Download and install the Windows x64 installer](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).
2. **C# Dev Kit**: Install the [C# Dev Kit extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) in VS Code.
3. *Important:* Restart VS Code completely after installing the SDK so your terminal recognizes the `dotnet` command.

## 2. Setup Your Environment Variables
We use `DotNetEnv` so our C# app reads the `.env` file just like Python did!
1. In the **root** folder of the project, make a copy of `.env.example` and name it `.env`.
2. Open `.env` and make sure your `DB_PASSWORD` is set to something secure (e.g., `Strong@Password123`).

## 3. Start the Database
We use Docker for the SQL Server database. In the root directory, run:
```bash
docker compose up -d
```
*Note: If you run into a "Login failed" error later, you might have an old docker volume. Fix it by running `docker compose down -v` and then spinning it up again.*

## 4. Run the Backend API
Navigate into the backend folder and start the API:
```bash
cd backend
dotnet run
```
*Note: `dotnet run` will automatically install the NuGet packages (like DotNetEnv and SqlClient) the first time you run it.*

## 5. Verify it Works
Once the console says `Now listening on: http://localhost:5xxx`, open your browser and test the DB connection:
👉 `http://localhost:5xxx/api/database/test-connection`

If it prints **"ADO.NET Connection is working perfectly!"**, your setup is complete!
