#!/usr/bin/env python3
"""
Simple script to run the waitlist backend locally
"""
import sys
import subprocess
import os
from pathlib import Path

def check_env_file():
    """Check if .env file exists"""
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print("Warning: .env file not found!")
        print("Please run setup_env.py first or create .env manually.")
        return False
    return True

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import fastapi
        import uvicorn
        import gspread
        import google.auth
        return True
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("\nPlease install dependencies first:")
        print("  pip install -r requirements.txt")
        return False

def main():
    """Run the FastAPI server locally"""
    print("=" * 60)
    print("Clinicflow Waitlist Backend - Local Server")
    print("=" * 60)
    print()
    
    # Check if .env exists
    if not check_env_file():
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("Starting server on http://localhost:8001")
    print("Press Ctrl+C to stop")
    print()
    print("Available endpoints:")
    print("  GET  http://localhost:8001/")
    print("  GET  http://localhost:8001/health")
    print("  POST http://localhost:8001/api/waitlist")
    print()
    print("-" * 60)
    print()
    
    # Change to the script directory
    os.chdir(Path(__file__).parent)
    
    # Run uvicorn
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--reload",
            "--port", "8001",
            "--host", "0.0.0.0"
        ])
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()

