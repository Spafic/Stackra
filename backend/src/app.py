from fastapi import FastAPI , Depends
from fastapi.middleware.cors import CORSMiddleware
from config.db import get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
@app.get("/health")
def health(conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    return {"status": "ok", "db": "connected"}