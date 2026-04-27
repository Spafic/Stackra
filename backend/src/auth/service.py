import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from config.db import execute_query

# --- DATABASE OPERATIONS ---

def get_user_by_email(email: str):
    """
    Fetches a user from MS SQL. 
    Returns a dictionary or None.
    """
    sql = "SELECT * FROM USERS WHERE Email = ?"
    result = execute_query(sql, [email])
    # Returns the first dict in the list if found, else None
    return result[0] if result else None

# --- AUTH LOGIC ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Directly uses bcrypt to avoid the passlib 72-byte bug.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception as e:
        print(f"Bcrypt error: {e}")
        return False

def create_tokens(email: str):
    """
    Generates Access and Refresh tokens using JWT.
    """
    secret = os.getenv("SECRET_KEY")
    algo = os.getenv("ALGORITHM", "HS256")
    
    # Access Token
    access_expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    access_payload = {"sub": email, "exp": access_expire, "type": "access"}
    access_token = jwt.encode(access_payload, secret, algorithm=algo)
    
    # Refresh Token
    refresh_expire = datetime.now(timezone.utc) + timedelta(days=7)
    refresh_payload = {"sub": email, "exp": refresh_expire, "type": "refresh"}
    refresh_token = jwt.encode(refresh_payload, secret, algorithm=algo)
    
    return access_token, refresh_token