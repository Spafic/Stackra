import pyodbc
from .settings import DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD

def get_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={DB_SERVER};DATABASE={DB_NAME};"
        f"UID={DB_USER};PWD={DB_PASSWORD}"
    )
    return pyodbc.connect(conn_str)