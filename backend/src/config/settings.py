import os

from dotenv import load_dotenv

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "1433"))
DB_NAME = os.getenv("DB_NAME", "stackra")
DB_USER = os.getenv("DB_USER", "sa")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))