from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config.db import get_connection

from auth.router import router as auth_router

app = FastAPI(title="Stackra API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)


@app.get("/health")
def health(conn=Depends(get_connection)):
    try:
        recordset, _ = conn.Execute("SELECT 1 AS health_check")
        value = None
        if not recordset.EOF:
            value = recordset.Fields("health_check").Value
        if recordset.State == 1:
            recordset.Close()

        if value == 1:
            return {"status": "ok", "db": "connected"}
        raise HTTPException(status_code=503, detail="Database probe failed")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Healthcheck failed: {exc}") from exc