"""
Pydantic settings for configuration management
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = "sqlite:///./tasks.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-minimum-32-characters-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours for production
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000,https://task-tracker-66mv.vercel.app,https://tasktrackerz.xyz,https://www.tasktrackerz.xyz"
    
    # Environment
    ENVIRONMENT: str = "development"  # development, production, staging
    
    # Email (Resend)
    RESEND_API_KEY: str = ""  # Set in environment variables
    EMAIL_FROM: str = "Task Tracker <onboarding@resend.dev>"  # Update with your verified domain
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
