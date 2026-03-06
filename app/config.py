from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    GETSONGBPM_API_KEY: str = ""
    GETSONGBPM_API_URL: str = "https://api.getsongbpm.com"
    CACHE_TTL_SECONDS: int = 86400  # 24 hours
    CACHE_MAX_SIZE: int = 1000

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
