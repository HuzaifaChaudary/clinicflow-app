import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Google Sheets
    GOOGLE_SHEETS_SPREADSHEET_ID: str = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
    GOOGLE_SERVICE_ACCOUNT_EMAIL: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
    GOOGLE_PRIVATE_KEY: str = os.getenv("GOOGLE_PRIVATE_KEY", "").replace("\\n", "\n")
    GOOGLE_PROJECT_ID: str = os.getenv("GOOGLE_PROJECT_ID", "")
    GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "")
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://useaxis.app",
        "https://www.useaxis.app",
        "https://axis-ebon.vercel.app",
        "https://axis-95499sypc-huzaifachaudarys-projects.vercel.app",
    ]
    
    @staticmethod
    def is_allowed_origin(origin: str) -> bool:
        """Check if origin is allowed (supports Vercel wildcard pattern)"""
        allowed_patterns = [
            "http://localhost",
            "http://127.0.0.1",
            "https://useaxis.app",
            "https://www.useaxis.app",
            "https://axis-",
            ".vercel.app",
        ]
        return any(pattern in origin for pattern in allowed_patterns)

settings = Settings()
