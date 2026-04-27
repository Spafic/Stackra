import pythoncom
import win32com.client
from pywintypes import com_error
from config.settings import get_settings

def _build_conn_str(database: str) -> str:
    settings = get_settings()
    return (
        "Provider=MSOLEDBSQL;"
        f"Data Source={settings.DB_SERVER},{settings.DB_PORT};"
        f"Initial Catalog={database};"
        f"User ID={settings.DB_USER};"
        f"Password={settings.DB_PASSWORD};"
        "Persist Security Info=False;"
    )

def _open_ado_connection(database: str):
    conn = win32com.client.Dispatch("ADODB.Connection")
    conn.ConnectionTimeout = 5
    conn.Open(_build_conn_str(database))
    return conn

def _ensure_database_exists() -> None:
    settings = get_settings()
    # Connect to 'master' to perform administrative tasks
    conn = _open_ado_connection("master")
    try:
        safe_db_name = settings.DB_NAME.replace("]", "]]")
        conn.Execute(
            f"IF DB_ID(N'{settings.DB_NAME}') IS NULL CREATE DATABASE [{safe_db_name}]"
        )
    finally:
        if conn.State == 1:
            conn.Close()

def get_connection():
    """FastAPI Dependency to provide a COM-initialized ADO connection."""
    settings = get_settings()
    pythoncom.CoInitialize()
    conn = None
    try:
        try:
            conn = _open_ado_connection(settings.DB_NAME)
        except com_error as exc:
            err = str(exc)
            if "Cannot open database" not in err:
                raise
            _ensure_database_exists()
            conn = _open_ado_connection(settings.DB_NAME)
        yield conn
    finally:
        if conn is not None and conn.State == 1:
            conn.Close()
        pythoncom.CoUninitialize()

def execute_query(sql, params=None):
    # This is the magic line that fixes the error.
    # It prepares the current thread to use COM objects.
    pythoncom.CoInitialize() 
    
    try:
        # Your existing connection logic...
        connection_string = "..." # Your actual connection string
        conn = win32com.client.Dispatch("ADODB.Connection")
        conn.Open(connection_string)
        
        cmd = win32com.client.Dispatch("ADODB.Command")
        cmd.ActiveConnection = conn
        cmd.CommandText = sql
        
        # ... rest of your existing execution logic ...
        
    finally:
        # Always uninitialize to clean up the thread memory
        pythoncom.CoUninitialize()