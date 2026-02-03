"""
Test script for reminder system
Run: python test_reminders.py
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_reminder_endpoints(token):
    """Test reminder API endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Testing reminder endpoints...")
    
    # Test confirmation reminders
    print("\n1. Testing confirmation reminders endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/reminders/send-confirmation",
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Success: {data}")
            task_id = data.get("task_id")
            if task_id:
                print(f"  Task ID: {task_id}")
                # Check task status
                status_response = requests.get(
                    f"{BASE_URL}/api/reminders/status/{task_id}",
                    headers=headers
                )
                if status_response.status_code == 200:
                    print(f"  Task Status: {status_response.json()}")
        else:
            print(f"✗ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # Test intake reminders
    print("\n2. Testing intake reminders endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/reminders/send-intake",
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Success: {data}")
            task_id = data.get("task_id")
            if task_id:
                print(f"  Task ID: {task_id}")
        else:
            print(f"✗ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_reminders.py <auth_token>")
        print("Get token by logging in at http://localhost:8000/api/auth/login")
        sys.exit(1)
    
    token = sys.argv[1]
    test_reminder_endpoints(token)

