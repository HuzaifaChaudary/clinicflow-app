#!/usr/bin/env python3
"""
Test script to verify Google Sheets integration is working.
Run this to check if your backend can connect to Google Sheets.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_env_vars():
    """Check if all required environment variables are set"""
    required_vars = [
        "GOOGLE_SHEETS_SPREADSHEET_ID",
        "GOOGLE_SERVICE_ACCOUNT_EMAIL",
        "GOOGLE_PRIVATE_KEY",
        "GOOGLE_PROJECT_ID"
    ]
    
    print("=" * 60)
    print("Checking Environment Variables...")
    print("=" * 60)
    
    missing = []
    for var in required_vars:
        value = os.getenv(var, "")
        if not value:
            print(f"[X] {var}: NOT SET")
            missing.append(var)
        else:
            # Mask sensitive values
            if "KEY" in var:
                masked = value[:20] + "..." if len(value) > 20 else value
                print(f"[OK] {var}: {masked}")
            else:
                print(f"[OK] {var}: {value}")
    
    if missing:
        print(f"\n⚠️  Missing environment variables: {', '.join(missing)}")
        return False
    else:
        print("\n[OK] All required environment variables are set!")
        return True

def test_google_sheets_connection():
    """Test Google Sheets connection"""
    print("\n" + "=" * 60)
    print("Testing Google Sheets Connection...")
    print("=" * 60)
    
    try:
        from app.services.google_sheets import GoogleSheetsService
        
        service = GoogleSheetsService()
        
        if service.client is None or service.spreadsheet is None:
            print("[X] Google Sheets is not configured or connection failed")
            print("\nPossible issues:")
            print("1. Environment variables not set correctly")
            print("2. Service account doesn't have access to the spreadsheet")
            print("3. Google Sheets API or Drive API not enabled")
            print("4. Invalid credentials")
            return False
        
        print("[OK] Google Sheets client initialized successfully")
        print(f"[OK] Connected to spreadsheet: {service.spreadsheet.title}")
        
        # Try to access the Waitlist worksheet
        try:
            worksheet = service.spreadsheet.worksheet("Waitlist")
            print(f"[OK] Found 'Waitlist' worksheet")
            print(f"   Rows: {worksheet.row_count}")
            print(f"   Columns: {worksheet.col_count}")
        except Exception as e:
            print(f"⚠️  'Waitlist' worksheet not found (will be created on first submission)")
            print(f"   Error: {e}")
        
        return True
        
    except Exception as e:
        print(f"[X] Error testing Google Sheets connection: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoint():
    """Test if the API endpoint is accessible"""
    print("\n" + "=" * 60)
    print("Testing API Endpoint...")
    print("=" * 60)
    
    try:
        import requests
        
        # Try local first
        url = "http://localhost:8001/health"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"[OK] Backend is running at http://localhost:8001")
                return True
        except requests.exceptions.ConnectionError:
            print("[X] Backend is not running at http://localhost:8001")
            print("\nTo start the backend, run:")
            print("  cd waitlist_backend")
            print("  python -m uvicorn app.main:app --reload --port 8001")
            return False
        except Exception as e:
            print(f"[X] Error connecting to backend: {e}")
            return False
            
    except ImportError:
        print("⚠️  'requests' library not installed. Skipping API test.")
        print("   Install with: pip install requests")
        return None

def main():
    """Run all tests"""
    print("\nGoogle Sheets Integration Diagnostic Tool\n")
    
    # Check environment variables
    env_ok = check_env_vars()
    
    if not env_ok:
        print("\n" + "=" * 60)
        print("❌ SETUP INCOMPLETE")
        print("=" * 60)
        print("\nPlease set the missing environment variables in your .env file.")
        print("See README.md for setup instructions.")
        sys.exit(1)
    
    # Test Google Sheets connection
    sheets_ok = test_google_sheets_connection()
    
    # Test API endpoint
    api_ok = test_api_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if env_ok and sheets_ok:
        print("[OK] Google Sheets integration is configured correctly!")
        print("\nYour backend should be able to save waitlist submissions to Google Sheets.")
    else:
        print("[X] Google Sheets integration is not working correctly.")
        print("\nPlease check:")
        print("1. All environment variables are set in .env file")
        print("2. Service account email has 'Editor' access to the spreadsheet")
        print("3. Google Sheets API and Drive API are enabled in Google Cloud Console")
        print("4. Private key is correctly formatted (with \\n for newlines)")
    
    if api_ok is False:
        print("\n[!] Backend server is not running.")
        print("   Start it to receive waitlist submissions.")

if __name__ == "__main__":
    main()

