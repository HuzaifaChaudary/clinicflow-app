import requests
import json

url = "http://localhost:8000/api/waitlist"

payload = {
    "clinicType": "dental",
    "otherClinicType": "",
    "clinicSize": "2-5",
    "painPoints": ["no-shows", "phone-calls"],
    "currentSetup": "front-desk",
    "impactLevel": "frustrating",
    "willingnessToPay": "yes",
    "priceRange": "100-250",
    "solutionWins": ["fewer-no-shows"],
    "otherWish": "",
    "role": "owner",
    "fullName": "Test User",
    "clinicName": "Test Dental Clinic",
    "email": "test@example.com",
    "phone": "1234567890"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
