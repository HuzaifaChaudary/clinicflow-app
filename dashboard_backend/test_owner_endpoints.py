import requests
import json
from datetime import date, timedelta

BASE_URL = "http://127.0.0.1:8000"

# Store results
results = {
    "owner": {},
    "admin": {}
}

def login(email, password):
    """Login and return token"""
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        return None
    except Exception as e:
        print(f"Login error: {e}")
        return None


def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Owner Dashboard Tests
def test_owner_dashboard(token):
    """Test GET /api/owner/dashboard"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/dashboard", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_owner_dashboard_with_params(token):
    """Test GET /api/owner/dashboard with parameters"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        today = date.today().isoformat()
        response = requests.get(
            f"{BASE_URL}/api/owner/dashboard?date={today}&period=month", 
            headers=headers
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Voice AI Tests
def test_voice_ai_logs_list(token):
    """Test GET /api/owner/voice-ai/logs"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/voice-ai/logs", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_voice_ai_stats(token):
    """Test GET /api/owner/voice-ai/stats"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/voice-ai/stats", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_voice_ai_log_create(token):
    """Test POST /api/owner/voice-ai/logs"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "call_type": "confirmation",
            "direction": "outbound",
            "status": "pending",
            "to_number": "+15551234567"
        }
        response = requests.post(
            f"{BASE_URL}/api/owner/voice-ai/logs", 
            headers=headers, 
            json=payload
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 201,
            "data": response.json() if response.status_code == 201 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_voice_ai_log_update(token, log_id):
    """Test PUT /api/owner/voice-ai/logs/{log_id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "status": "completed",
            "outcome": "confirmed",
            "duration_seconds": 45
        }
        response = requests.put(
            f"{BASE_URL}/api/owner/voice-ai/logs/{log_id}", 
            headers=headers, 
            json=payload
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Automation Rules Tests
def test_automation_rules_list(token):
    """Test GET /api/owner/automation/rules"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/automation/rules", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_automation_rule_create(token):
    """Test POST /api/owner/automation/rules"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "Test Confirmation Rule",
            "description": "Sends SMS confirmation on appointment creation",
            "rule_type": "confirmation",
            "trigger_event": "appointment_created",
            "trigger_conditions": {},
            "action_type": "send_sms",
            "action_config": {"template": "confirmation"},
            "enabled": True,
            "priority": 10
        }
        response = requests.post(
            f"{BASE_URL}/api/owner/automation/rules", 
            headers=headers, 
            json=payload
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 201,
            "data": response.json() if response.status_code == 201 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_automation_rule_get(token, rule_id):
    """Test GET /api/owner/automation/rules/{rule_id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{BASE_URL}/api/owner/automation/rules/{rule_id}", 
            headers=headers
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_automation_rule_update(token, rule_id):
    """Test PUT /api/owner/automation/rules/{rule_id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "Updated Confirmation Rule",
            "enabled": False
        }
        response = requests.put(
            f"{BASE_URL}/api/owner/automation/rules/{rule_id}", 
            headers=headers, 
            json=payload
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_automation_rule_delete(token, rule_id):
    """Test DELETE /api/owner/automation/rules/{rule_id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(
            f"{BASE_URL}/api/owner/automation/rules/{rule_id}", 
            headers=headers
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 204
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_automation_executions_list(token):
    """Test GET /api/owner/automation/executions"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{BASE_URL}/api/owner/automation/executions", 
            headers=headers
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Settings Tests
def test_settings_get(token):
    """Test GET /api/owner/settings"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/settings", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def test_settings_update(token):
    """Test PUT /api/owner/settings"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "voice_ai_enabled": True,
            "sms_enabled": True,
            "confirmation_reminder_hours": 24,
            "timezone": "America/New_York"
        }
        response = requests.put(
            f"{BASE_URL}/api/owner/settings", 
            headers=headers, 
            json=payload
        )
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Metrics Tests
def test_metrics_get(token):
    """Test GET /api/owner/metrics"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/metrics", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


# Capacity Tests
def test_capacity_get(token):
    """Test GET /api/owner/capacity"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/owner/capacity", headers=headers)
        return {
            "status": response.status_code, 
            "success": response.status_code == 200,
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}


def run_owner_tests():
    print("=" * 80)
    print("TESTING CLINICFLOW OWNER BACKEND ENDPOINTS")
    print("=" * 80)
    
    # Test health
    print("\n[HEALTH CHECK]")
    health = test_health()
    print(f"GET /health: {health['status']} {'✓' if health['success'] else '✗'}")
    
    if not health['success']:
        print("❌ Backend not running! Start with: uvicorn app.main:app --reload")
        return None
    
    # Test as Admin (owner endpoints should work for admin too)
    print("\n" + "=" * 80)
    print("TESTING OWNER ENDPOINTS AS ADMIN (admin@clinic.com)")
    print("=" * 80)
    
    admin_token = login("admin@clinic.com", "admin123")
    if not admin_token:
        print("❌ Admin login failed! Make sure seed data exists.")
        return None
    
    print(f"\n✓ Admin authenticated successfully")
    
    # Owner Dashboard
    print("\n[OWNER DASHBOARD ENDPOINTS]")
    
    result = test_owner_dashboard(admin_token)
    results["admin"]["GET /api/owner/dashboard"] = result
    print(f"GET /api/owner/dashboard: {result['status']} {'✓' if result['success'] else '✗'}")
    if result['success'] and result.get('data'):
        data = result['data']
        print(f"   → Hero metrics: {len(data.get('hero_metrics', []))} items")
        print(f"   → Doctors: {len(data.get('doctor_capacity', []))} doctors")
    
    result = test_owner_dashboard_with_params(admin_token)
    results["admin"]["GET /api/owner/dashboard?date&period"] = result
    print(f"GET /api/owner/dashboard?date&period: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Voice AI
    print("\n[VOICE AI ENDPOINTS]")
    
    result = test_voice_ai_logs_list(admin_token)
    results["admin"]["GET /api/owner/voice-ai/logs"] = result
    print(f"GET /api/owner/voice-ai/logs: {result['status']} {'✓' if result['success'] else '✗'}")
    
    result = test_voice_ai_stats(admin_token)
    results["admin"]["GET /api/owner/voice-ai/stats"] = result
    print(f"GET /api/owner/voice-ai/stats: {result['status']} {'✓' if result['success'] else '✗'}")
    
    result = test_voice_ai_log_create(admin_token)
    results["admin"]["POST /api/owner/voice-ai/logs"] = result
    print(f"POST /api/owner/voice-ai/logs: {result['status']} {'✓' if result['success'] else '✗'}")
    
    voice_log_id = None
    if result['success'] and result.get('data'):
        voice_log_id = result['data']['id']
        
        result = test_voice_ai_log_update(admin_token, voice_log_id)
        results["admin"]["PUT /api/owner/voice-ai/logs/:id"] = result
        print(f"PUT /api/owner/voice-ai/logs/:id: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Automation Rules
    print("\n[AUTOMATION RULES ENDPOINTS]")
    
    result = test_automation_rules_list(admin_token)
    results["admin"]["GET /api/owner/automation/rules"] = result
    print(f"GET /api/owner/automation/rules: {result['status']} {'✓' if result['success'] else '✗'}")
    
    result = test_automation_rule_create(admin_token)
    results["admin"]["POST /api/owner/automation/rules"] = result
    print(f"POST /api/owner/automation/rules: {result['status']} {'✓' if result['success'] else '✗'}")
    
    rule_id = None
    if result['success'] and result.get('data'):
        rule_id = result['data']['id']
        
        result = test_automation_rule_get(admin_token, rule_id)
        results["admin"]["GET /api/owner/automation/rules/:id"] = result
        print(f"GET /api/owner/automation/rules/:id: {result['status']} {'✓' if result['success'] else '✗'}")
        
        result = test_automation_rule_update(admin_token, rule_id)
        results["admin"]["PUT /api/owner/automation/rules/:id"] = result
        print(f"PUT /api/owner/automation/rules/:id: {result['status']} {'✓' if result['success'] else '✗'}")
        
        result = test_automation_rule_delete(admin_token, rule_id)
        results["admin"]["DELETE /api/owner/automation/rules/:id"] = result
        print(f"DELETE /api/owner/automation/rules/:id: {result['status']} {'✓' if result['success'] else '✗'}")
    
    result = test_automation_executions_list(admin_token)
    results["admin"]["GET /api/owner/automation/executions"] = result
    print(f"GET /api/owner/automation/executions: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Settings
    print("\n[SETTINGS ENDPOINTS]")
    
    result = test_settings_get(admin_token)
    results["admin"]["GET /api/owner/settings"] = result
    print(f"GET /api/owner/settings: {result['status']} {'✓' if result['success'] else '✗'}")
    
    result = test_settings_update(admin_token)
    results["admin"]["PUT /api/owner/settings"] = result
    print(f"PUT /api/owner/settings: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Metrics
    print("\n[METRICS ENDPOINTS]")
    
    result = test_metrics_get(admin_token)
    results["admin"]["GET /api/owner/metrics"] = result
    print(f"GET /api/owner/metrics: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Capacity
    print("\n[CAPACITY ENDPOINTS]")
    
    result = test_capacity_get(admin_token)
    results["admin"]["GET /api/owner/capacity"] = result
    print(f"GET /api/owner/capacity: {result['status']} {'✓' if result['success'] else '✗'}")
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    total_tests = len(results["admin"])
    passed = sum(1 for r in results["admin"].values() if r.get("success"))
    failed = total_tests - passed
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"Passed: {passed} ✓")
    print(f"Failed: {failed} ✗")
    print(f"Success Rate: {(passed/total_tests*100):.1f}%")
    
    if failed > 0:
        print("\nFailed Tests:")
        for endpoint, result in results["admin"].items():
            if not result.get("success"):
                print(f"  ✗ {endpoint}: {result.get('status')}")
    
    return results


def run_integration_tests():
    """Run integration tests between admin, doctor, and owner dashboards"""
    print("\n" + "=" * 80)
    print("INTEGRATION TESTS: Admin → Doctor → Owner")
    print("=" * 80)
    
    # Login as admin
    admin_token = login("admin@clinic.com", "admin123")
    if not admin_token:
        print("❌ Admin login failed!")
        return
    
    print("\n✓ Admin logged in")
    
    # Login as doctor
    doctor_token = login("sarah.chen@clinic.com", "doctor123")
    if not doctor_token:
        print("❌ Doctor login failed!")
        return
    
    print("✓ Doctor logged in")
    
    # Test 1: Admin creates appointment → Check owner metrics update
    print("\n[TEST 1: Appointment Creation Flow]")
    
    # Get doctor and patient IDs
    headers = {"Authorization": f"Bearer {admin_token}"}
    doctors_resp = requests.get(f"{BASE_URL}/api/doctors", headers=headers)
    patients_resp = requests.get(f"{BASE_URL}/api/patients", headers=headers)
    
    if doctors_resp.status_code == 200 and patients_resp.status_code == 200:
        doctors_data = doctors_resp.json()
        patients_data = patients_resp.json()
        
        # Handle both list and paginated response formats
        doctors = doctors_data if isinstance(doctors_data, list) else doctors_data.get("items", [])
        patients = patients_data if isinstance(patients_data, list) else patients_data.get("items", [])
        
        if doctors and patients:
            doctor_id = doctors[0]["id"]
            patient_id = patients[0]["id"]
            
            # Create appointment
            tomorrow = (date.today() + timedelta(days=1)).isoformat()
            appt_payload = {
                "doctor_id": doctor_id,
                "patient_id": patient_id,
                "date": tomorrow,
                "start_time": "10:00:00",
                "end_time": "10:30:00",
                "duration": 30,
                "visit_type": "in-clinic",
                "visit_category": "new-patient"
            }
            
            appt_resp = requests.post(
                f"{BASE_URL}/api/appointments",
                headers=headers,
                json=appt_payload
            )
            
            if appt_resp.status_code == 201:
                appt = appt_resp.json()
                print(f"  ✓ Admin created appointment: {appt['id'][:8]}...")
                
                # Check owner dashboard reflects the appointment
                owner_resp = requests.get(
                    f"{BASE_URL}/api/owner/dashboard?date={tomorrow}",
                    headers=headers
                )
                
                if owner_resp.status_code == 200:
                    owner_data = owner_resp.json()
                    print(f"  ✓ Owner dashboard updated")
                    print(f"    → Total appointments in period: check hero_metrics")
                else:
                    print(f"  ✗ Owner dashboard failed: {owner_resp.status_code}")
                
                # Check doctor dashboard shows the appointment
                doc_headers = {"Authorization": f"Bearer {doctor_token}"}
                doc_resp = requests.get(
                    f"{BASE_URL}/api/dashboard/doctor?date={tomorrow}",
                    headers=doc_headers
                )
                
                if doc_resp.status_code == 200:
                    doc_data = doc_resp.json()
                    print(f"  ✓ Doctor dashboard updated")
                    print(f"    → Today's patients: {len(doc_data.get('todays_patients', []))}")
                else:
                    print(f"  ✗ Doctor dashboard failed: {doc_resp.status_code}")
            else:
                print(f"  ✗ Failed to create appointment: {appt_resp.status_code}")
    
    # Test 2: Admin confirms appointment → Check metrics
    print("\n[TEST 2: Appointment Confirmation Flow]")
    
    # Get an unconfirmed appointment
    appts_resp = requests.get(
        f"{BASE_URL}/api/appointments?status=unconfirmed",
        headers=headers
    )
    
    if appts_resp.status_code == 200:
        appts_data = appts_resp.json()
        # Handle both list and paginated response formats
        appts = appts_data if isinstance(appts_data, list) else appts_data.get("items", [])
        if appts:
            appt_id = appts[0]["id"]
            
            confirm_resp = requests.post(
                f"{BASE_URL}/api/appointments/{appt_id}/confirm",
                headers=headers,
                json={}
            )
            
            if confirm_resp.status_code == 200:
                print(f"  ✓ Admin confirmed appointment: {appt_id[:8]}...")
                
                # Check admin dashboard stats update
                admin_dash = requests.get(
                    f"{BASE_URL}/api/dashboard/admin",
                    headers=headers
                )
                
                if admin_dash.status_code == 200:
                    stats = admin_dash.json().get("stats", {})
                    print(f"  ✓ Admin dashboard stats:")
                    print(f"    → Confirmed: {stats.get('confirmed', 0)}")
                    print(f"    → Unconfirmed: {stats.get('unconfirmed', 0)}")
            else:
                print(f"  ✗ Failed to confirm: {confirm_resp.status_code}")
        else:
            print("  ⚠ No unconfirmed appointments to test")
    
    # Test 3: Voice AI log creation → Check stats
    print("\n[TEST 3: Voice AI Logging Flow]")
    
    voice_log = {
        "call_type": "confirmation",
        "direction": "outbound",
        "status": "completed",
        "outcome": "confirmed",
        "to_number": "+15551234567"
    }
    
    voice_resp = requests.post(
        f"{BASE_URL}/api/owner/voice-ai/logs",
        headers=headers,
        json=voice_log
    )
    
    if voice_resp.status_code == 201:
        print(f"  ✓ Voice AI log created")
        
        # Check stats update
        stats_resp = requests.get(
            f"{BASE_URL}/api/owner/voice-ai/stats",
            headers=headers
        )
        
        if stats_resp.status_code == 200:
            stats = stats_resp.json().get("stats", {})
            print(f"  ✓ Voice AI stats:")
            print(f"    → Total calls: {stats.get('total_calls', 0)}")
            print(f"    → Success rate: {stats.get('success_rate', 0)}%")
    else:
        print(f"  ✗ Failed to create voice log: {voice_resp.status_code}")
    
    print("\n" + "=" * 80)
    print("INTEGRATION TESTS COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    results = run_owner_tests()
    
    if results:
        # Save results to file
        with open("test_owner_results.json", "w") as f:
            json.dump(results, f, indent=2, default=str)
        
        print("\n✓ Results saved to test_owner_results.json")
        
        # Run integration tests
        run_integration_tests()
