from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:////data/portfolio.db"
    jwt_secret: str = "change-me-in-prod-please-use-env-var"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 1 week
    admin_username: str = "admin"
    admin_password: str = "changeme"
    upload_dir: str = "/data/uploads"
    cors_origins: str = "*"
    public_base_url: str = ""  # e.g. https://api.example.com — used to build absolute upload URLs


settings = Settings()

# Ensure upload dir exists
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
