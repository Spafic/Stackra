# Backend

FastAPI + MSSQL backend using raw SQL (pyodbc). No ORM.

## Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager
- ODBC Driver 17 for SQL Server

## Setup

```bash
uv venv
.venv\Scripts\activate        # Windows
uv sync
```

## Environment

Create a `.env` file in `backend/`:

```env
DB_SERVER=localhost
DB_NAME=your_db
DB_USER=sa
DB_PASSWORD=yourpassword
SECRET_KEY=changeme
```

## Run

1. dev mode
```bash
uv run fastapi dev src/app.py
```
2. production mode
uv run uvicorn src.app:app

## Folder Structure & Modular Routing
The project follows a modular pattern where each major feature resides in its own directory (e.g., /jobs, /offers). This keeps concerns separated and ensures that helpers, schemas, and validations are scoped to their respective features.

#### Feature Directory Layout
Each module typically contains:

router.py: Defines the API endpoints for the feature.

schemas.py: Pydantic models for request/response validation.

utils.py: Helper functions specific to the module.

#### Centralized Routing
The router.py file is the entry point for each feature. These individual routers are then aggregated in the main application file (src/main.py or src/app.py) using FastAPI's include_router method.

#### Example Implementation:

```Python
from fastapi import FastAPI
from .auth.router import router as auth_router
from .jobs.router import router as jobs_router

app = FastAPI()

# Registering modular routers
app.include_router(
    auth_router, 
    prefix="/auth", 
    tags=["Authentication"]
)

app.include_router(
    jobs_router, 
    prefix="/jobs", 
    tags=["Jobs"]
)
```
Note: Using tags helps FastAPI automatically group your endpoints in the interactive Swagger UI (/docs), making the API much easier to navigate for frontend collaborators.