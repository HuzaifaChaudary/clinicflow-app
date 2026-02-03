#!/usr/bin/env python3
"""
Test production backend endpoint to check if Google Sheets is configured
"""

import requests
import json

def test_production_backend():
    """Test the production backend endpoint"""
    backend_url = "https://axisbackend.vercel.app"
    
    print("=" * 60)
    print("Testing Production Backend")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{backend_url}/health", timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   [X] Error: {e}")
    
    # Test 2: Check environment variables
    print("\n2. Checking environment variables...")
    try:
        response = requests.get(f"{backend_url}/debug/env", timeout=10)
        print(f"   Status: {response.status_code}")
        env_data = response.json()
        print(f"   Spreadsheet ID set: {env_data.get('spreadsheet_id_set')}")
        print(f"   Service email set: {env_data.get('service_email_set')}")
        print(f"   Private key set: {env_data.get('private_key_set')}")
        print(f"   Private key length: {env_data.get('private_key_length')}")
        print(f"   Project ID set: {env_data.get('project_id_set')}")
        
        if not all([
            env_data.get('spreadsheet_id_set'),
            env_data.get('service_email_set'),
            env_data.get('private_key_set'),
            env_data.get('project_id_set')
        ]):
            print("\n   [X] MISSING ENVIRONMENT VARIABLES!")
            print("   Go to: https://vercel.com/huzaifachaudarys-projects/axis_backend/settings/environment-variables")
            return False
        else:
            print("\n   [OK] All environment variables are set")
    except Exception as e:
        print(f"   [X] Error: {e}")
        return False
    
    # Test 3: Test waitlist submission
    print("\n3. Testing waitlist submission...")
    test_data = {
        "clinicType": "dental",
        "clinicSize": "2-5",
        "painPoints": ["no-shows"],
        "currentSetup": "front-desk",
        "impactLevel": "frustrating",
        "willingnessToPay": "yes",
        "priceRange": "100-250",
        "solutionWins": ["fewer-no-shows"],
        "role": "owner",
        "fullName": "Test User",
        "clinicName": "Test Clinic",
        "email": "test@example.com"
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/waitlist",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        result = response.json()
        print(f"   Response: {json.dumps(result, indent=2)}")
        
        if result.get('success') and 'error' not in result.get('message', '').lower():
            print("\n   [OK] Submission successful!")
            print("   Check your Google Sheet to verify data was saved.")
            return True
        else:
            print(f"\n   [X] Submission returned: {result.get('message')}")
            if 'config missing' in result.get('message', '').lower():
                print("   -> Environment variables are not set in Vercel")
            elif 'error' in result.get('message', '').lower():
                print("   -> There was an error saving to Google Sheets")
            return False
    except Exception as e:
        print(f"   [X] Error: {e}")
        return False

if __name__ == "__main__":
    test_production_backend()

