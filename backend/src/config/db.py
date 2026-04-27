import pythoncom
import win32com.client
from pywintypes import com_error

from config.settings import (
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_SERVER,
    DB_USER,
)


def _build_conn_str(database: str) -> str:
    return (
        "Provider=MSOLEDBSQL;"
        f"Data Source={DB_SERVER},{DB_PORT};"
        f"Initial Catalog={database};"
        f"User ID={DB_USER};"
        f"Password={DB_PASSWORD};"
        "Persist Security Info=False;"
    )


def _open_ado_connection(database: str):
    conn = win32com.client.Dispatch("ADODB.Connection")
    conn.ConnectionTimeout = 5
    conn.Open(_build_conn_str(database))
    return conn


def _ensure_database_exists() -> None:
    conn = _open_ado_connection("master")
    try:
        safe_db_name = DB_NAME.replace("]", "]]")
        conn.Execute(
            f"IF DB_ID(N'{DB_NAME}') IS NULL CREATE DATABASE [{safe_db_name}]"
        )
    finally:
        if conn.State == 1:
            conn.Close()


def get_connection():
    # Native Windows ADO provider connection via COM (no adodbapi package).
    pythoncom.CoInitialize()
    conn = None
    try:
        try:
            conn = _open_ado_connection(DB_NAME)
        except com_error as exc:
            err = str(exc)
            if "Cannot open database" not in err:
                raise
            _ensure_database_exists()
            conn = _open_ado_connection(DB_NAME)
        yield conn
    finally:
        if conn is not None and conn.State == 1:
            conn.Close()
        pythoncom.CoUninitialize()