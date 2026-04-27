from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # DB Settings
    DB_SERVER: str = "localhost"
    DB_PORT: int = 1433
    DB_NAME: str = "stackra"
    DB_USER: str = "sa"
    DB_PASSWORD: str = ""

    # Auth Settings
    SECRET_KEY: str = "changeme"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings():
    return Settings()