import pyodbc
from config.settings import DB_SERVER, DB_NAME

def get_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"Trusted_Connection=yes;"
        f"TrustServerCertificate=yes;"
        f"Encrypt=no;"
    )
    return pyodbc.connect(conn_str)

def get_db():
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()