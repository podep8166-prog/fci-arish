import os
from typing import List
from dotenv import load_dotenv

# Explicitly load .env file
load_dotenv()

class Settings:
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    USER_RATE_LIMIT: str = os.getenv("USER_RATE_LIMIT", "10/minute")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500")
    MODEL_REQUEST_LIMIT: int = int(os.getenv("MODEL_REQUEST_LIMIT", "50"))
    MAX_MESSAGE_LENGTH: int = int(os.getenv("MAX_MESSAGE_LENGTH", "500"))
    MAX_HISTORY_MESSAGES: int = int(os.getenv("MAX_HISTORY_MESSAGES", "4"))
    MAX_OUTPUT_TOKENS: int = int(os.getenv("MAX_OUTPUT_TOKENS", "600"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    ENABLE_DOCS: bool = os.getenv("ENABLE_DOCS", "true").lower() == "true"
    
    def get_allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        
settings = Settings()
