import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Store results
results = {
    "admin": {},
    "doctor": {}
}

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False, "error": str(e)}

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

def test_me(token):
    """Test /me endpoint"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_doctors_list(token):
    """Test GET /api/doctors"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/doctors", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_doctors_get(token, doctor_id):
    """Test GET /api/doctors/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/doctors/{doctor_id}", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_doctors_create(token):
    """Test POST /api/doctors"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "Dr. Test Doctor",
            "specialty": "Test Specialty",
            "initials": "TD",
            "color": "#FF5733"
        }
        response = requests.post(f"{BASE_URL}/api/doctors", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 201, "data": response.json() if response.status_code == 201 else None}
    except Exception as e:
        return {"status": "error", "success": False}

def test_doctors_update(token, doctor_id):
    """Test PUT /api/doctors/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "Dr. Updated Doctor",
            "specialty": "Updated Specialty"
        }
        response = requests.put(f"{BASE_URL}/api/doctors/{doctor_id}", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_doctors_delete(token, doctor_id):
    """Test DELETE /api/doctors/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/api/doctors/{doctor_id}", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 204}
    except Exception as e:
        return {"status": "error", "success": False}

def test_patients_list(token):
    """Test GET /api/patients"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/patients", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_patients_get(token, patient_id):
    """Test GET /api/patients/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/patients/{patient_id}", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_patients_create(token):
    """Test POST /api/patients"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "first_name": "Test",
            "last_name": "Patient",
            "email": "test.patient@example.com",
            "phone": "555-1234"
        }
        response = requests.post(f"{BASE_URL}/api/patients", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 201, "data": response.json() if response.status_code == 201 else None}
    except Exception as e:
        return {"status": "error", "success": False}

def test_patients_update(token, patient_id):
    """Test PUT /api/patients/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "first_name": "Updated",
            "last_name": "Patient"
        }
        response = requests.put(f"{BASE_URL}/api/patients/{patient_id}", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_patients_appointments(token, patient_id):
    """Test GET /api/patients/{id}/appointments"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/patients/{patient_id}/appointments", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_list(token):
    """Test GET /api/appointments"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/appointments", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_get(token, appointment_id):
    """Test GET /api/appointments/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/appointments/{appointment_id}", headers=headers)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_create(token, doctor_id, patient_id):
    """Test POST /api/appointments"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "date": "2026-01-10",
            "start_time": "14:00:00",
            "end_time": "14:30:00",
            "duration": 30,
            "visit_type": "in-clinic",
            "visit_category": "new-patient"
        }
        response = requests.post(f"{BASE_URL}/api/appointments", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 201, "data": response.json() if response.status_code == 201 else None}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_update(token, appointment_id):
    """Test PUT /api/appointments/{id}"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "visit_type": "virtual"
        }
        response = requests.put(f"{BASE_URL}/api/appointments/{appointment_id}", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_confirm(token, appointment_id):
    """Test POST /api/appointments/{id}/confirm"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/api/appointments/{appointment_id}/confirm", headers=headers, json={})
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_arrive(token, appointment_id):
    """Test POST /api/appointments/{id}/arrive"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/api/appointments/{appointment_id}/arrive", headers=headers, json={})
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def test_appointments_cancel(token, appointment_id):
    """Test POST /api/appointments/{id}/cancel"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "cancellation_type": "clinic-cancelled",
            "reason_note": "Testing cancellation"
        }
        response = requests.post(f"{BASE_URL}/api/appointments/{appointment_id}/cancel", headers=headers, json=payload)
        return {"status": response.status_code, "success": response.status_code == 200}
    except Exception as e:
        return {"status": "error", "success": False}

def get_first_doctor_id(token):
    """Get first doctor ID from list"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/doctors", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return data[0]["id"]
    except:
        pass
    return None

def get_first_patient_id(token):
    """Get first patient ID from list"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/patients", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return data[0]["id"]
    except:
        pass
    return None

def get_first_appointment_id(token):
    """Get first appointment ID from list"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/appointments", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return data[0]["id"]
    except:
        pass
    return None

def run_tests():
    print("=" * 80)
    print("TESTING CLINICFLOW BACKEND ENDPOINTS")
    print("=" * 80)
    
    # Test health
    print("\n[HEALTH CHECK]")
    health = test_health()
    print(f"GET /health: {health['status']} {'✓' if health['success'] else '✗'}")
    
    # Test as Admin
    print("\n" + "=" * 80)
    print("TESTING AS ADMIN (admin@clinic.com)")
    print("=" * 80)
    
    admin_token = login("admin@clinic.com", "admin123")
    if not admin_token:
        print("❌ Admin login failed!")
        return
    
    print(f"\n✓ Admin authenticated successfully")
    
    # Auth endpoints
    print("\n[AUTH ENDPOINTS]")
    results["admin"]["POST /api/auth/login"] = {"status": 200, "success": True}
    results["admin"]["GET /api/auth/me"] = test_me(admin_token)
    print(f"POST /api/auth/login: 200 ✓")
    print(f"GET /api/auth/me: {results['admin']['GET /api/auth/me']['status']} {'✓' if results['admin']['GET /api/auth/me']['success'] else '✗'}")
    
    # Doctors endpoints
    print("\n[DOCTORS ENDPOINTS]")
    results["admin"]["GET /api/doctors"] = test_doctors_list(admin_token)
    print(f"GET /api/doctors: {results['admin']['GET /api/doctors']['status']} {'✓' if results['admin']['GET /api/doctors']['success'] else '✗'}")
    
    doctor_id = get_first_doctor_id(admin_token)
    if doctor_id:
        results["admin"]["GET /api/doctors/:id"] = test_doctors_get(admin_token, doctor_id)
        print(f"GET /api/doctors/:id: {results['admin']['GET /api/doctors/:id']['status']} {'✓' if results['admin']['GET /api/doctors/:id']['success'] else '✗'}")
    
    create_doctor = test_doctors_create(admin_token)
    results["admin"]["POST /api/doctors"] = create_doctor
    print(f"POST /api/doctors: {create_doctor['status']} {'✓' if create_doctor['success'] else '✗'}")
    
    if create_doctor['success'] and create_doctor.get('data'):
        new_doctor_id = create_doctor['data']['id']
        results["admin"]["PUT /api/doctors/:id"] = test_doctors_update(admin_token, new_doctor_id)
        print(f"PUT /api/doctors/:id: {results['admin']['PUT /api/doctors/:id']['status']} {'✓' if results['admin']['PUT /api/doctors/:id']['success'] else '✗'}")
        
        results["admin"]["DELETE /api/doctors/:id"] = test_doctors_delete(admin_token, new_doctor_id)
        print(f"DELETE /api/doctors/:id: {results['admin']['DELETE /api/doctors/:id']['status']} {'✓' if results['admin']['DELETE /api/doctors/:id']['success'] else '✗'}")
    
    # Patients endpoints
    print("\n[PATIENTS ENDPOINTS]")
    results["admin"]["GET /api/patients"] = test_patients_list(admin_token)
    print(f"GET /api/patients: {results['admin']['GET /api/patients']['status']} {'✓' if results['admin']['GET /api/patients']['success'] else '✗'}")
    
    patient_id = get_first_patient_id(admin_token)
    if patient_id:
        results["admin"]["GET /api/patients/:id"] = test_patients_get(admin_token, patient_id)
        print(f"GET /api/patients/:id: {results['admin']['GET /api/patients/:id']['status']} {'✓' if results['admin']['GET /api/patients/:id']['success'] else '✗'}")
        
        results["admin"]["GET /api/patients/:id/appointments"] = test_patients_appointments(admin_token, patient_id)
        print(f"GET /api/patients/:id/appointments: {results['admin']['GET /api/patients/:id/appointments']['status']} {'✓' if results['admin']['GET /api/patients/:id/appointments']['success'] else '✗'}")
    
    create_patient = test_patients_create(admin_token)
    results["admin"]["POST /api/patients"] = create_patient
    print(f"POST /api/patients: {create_patient['status']} {'✓' if create_patient['success'] else '✗'}")
    
    if create_patient['success'] and create_patient.get('data'):
        new_patient_id = create_patient['data']['id']
        results["admin"]["PUT /api/patients/:id"] = test_patients_update(admin_token, new_patient_id)
        print(f"PUT /api/patients/:id: {results['admin']['PUT /api/patients/:id']['status']} {'✓' if results['admin']['PUT /api/patients/:id']['success'] else '✗'}")
    
    # Appointments endpoints
    print("\n[APPOINTMENTS ENDPOINTS]")
    results["admin"]["GET /api/appointments"] = test_appointments_list(admin_token)
    print(f"GET /api/appointments: {results['admin']['GET /api/appointments']['status']} {'✓' if results['admin']['GET /api/appointments']['success'] else '✗'}")
    
    appointment_id = get_first_appointment_id(admin_token)
    if appointment_id:
        results["admin"]["GET /api/appointments/:id"] = test_appointments_get(admin_token, appointment_id)
        print(f"GET /api/appointments/:id: {results['admin']['GET /api/appointments/:id']['status']} {'✓' if results['admin']['GET /api/appointments/:id']['success'] else '✗'}")
    
    if doctor_id and patient_id:
        create_appt = test_appointments_create(admin_token, doctor_id, patient_id)
        results["admin"]["POST /api/appointments"] = create_appt
        print(f"POST /api/appointments: {create_appt['status']} {'✓' if create_appt['success'] else '✗'}")
        
        if create_appt['success'] and create_appt.get('data'):
            new_appt_id = create_appt['data']['id']
            results["admin"]["PUT /api/appointments/:id"] = test_appointments_update(admin_token, new_appt_id)
            print(f"PUT /api/appointments/:id: {results['admin']['PUT /api/appointments/:id']['status']} {'✓' if results['admin']['PUT /api/appointments/:id']['success'] else '✗'}")
            
            results["admin"]["POST /api/appointments/:id/confirm"] = test_appointments_confirm(admin_token, new_appt_id)
            print(f"POST /api/appointments/:id/confirm: {results['admin']['POST /api/appointments/:id/confirm']['status']} {'✓' if results['admin']['POST /api/appointments/:id/confirm']['success'] else '✗'}")
            
            results["admin"]["POST /api/appointments/:id/arrive"] = test_appointments_arrive(admin_token, new_appt_id)
            print(f"POST /api/appointments/:id/arrive: {results['admin']['POST /api/appointments/:id/arrive']['status']} {'✓' if results['admin']['POST /api/appointments/:id/arrive']['success'] else '✗'}")
            
            results["admin"]["POST /api/appointments/:id/cancel"] = test_appointments_cancel(admin_token, new_appt_id)
            print(f"POST /api/appointments/:id/cancel: {results['admin']['POST /api/appointments/:id/cancel']['status']} {'✓' if results['admin']['POST /api/appointments/:id/cancel']['success'] else '✗'}")
    
    # Test as Doctor
    print("\n" + "=" * 80)
    print("TESTING AS DOCTOR (sarah.chen@clinic.com)")
    print("=" * 80)
    
    doctor_token = login("sarah.chen@clinic.com", "doctor123")
    if not doctor_token:
        print("❌ Doctor login failed!")
        return
    
    print(f"\n✓ Doctor authenticated successfully")
    
    # Auth endpoints
    print("\n[AUTH ENDPOINTS]")
    results["doctor"]["POST /api/auth/login"] = {"status": 200, "success": True}
    results["doctor"]["GET /api/auth/me"] = test_me(doctor_token)
    print(f"POST /api/auth/login: 200 ✓")
    print(f"GET /api/auth/me: {results['doctor']['GET /api/auth/me']['status']} {'✓' if results['doctor']['GET /api/auth/me']['success'] else '✗'}")
    
    # Doctors endpoints
    print("\n[DOCTORS ENDPOINTS]")
    results["doctor"]["GET /api/doctors"] = test_doctors_list(doctor_token)
    print(f"GET /api/doctors: {results['doctor']['GET /api/doctors']['status']} {'✓' if results['doctor']['GET /api/doctors']['success'] else '✗'}")
    
    if doctor_id:
        results["doctor"]["GET /api/doctors/:id"] = test_doctors_get(doctor_token, doctor_id)
        print(f"GET /api/doctors/:id: {results['doctor']['GET /api/doctors/:id']['status']} {'✓' if results['doctor']['GET /api/doctors/:id']['success'] else '✗'}")
    
    create_doctor_doc = test_doctors_create(doctor_token)
    results["doctor"]["POST /api/doctors"] = create_doctor_doc
    print(f"POST /api/doctors: {create_doctor_doc['status']} {'✗ (Expected - Doctor role cannot create)' if create_doctor_doc['status'] == 403 else '?'}")
    
    # Patients endpoints
    print("\n[PATIENTS ENDPOINTS]")
    results["doctor"]["GET /api/patients"] = test_patients_list(doctor_token)
    print(f"GET /api/patients: {results['doctor']['GET /api/patients']['status']} {'✓' if results['doctor']['GET /api/patients']['success'] else '✗'}")
    
    if patient_id:
        results["doctor"]["GET /api/patients/:id"] = test_patients_get(doctor_token, patient_id)
        print(f"GET /api/patients/:id: {results['doctor']['GET /api/patients/:id']['status']} {'✓' if results['doctor']['GET /api/patients/:id']['success'] else '✗'}")
    
    # Appointments endpoints
    print("\n[APPOINTMENTS ENDPOINTS]")
    results["doctor"]["GET /api/appointments"] = test_appointments_list(doctor_token)
    print(f"GET /api/appointments: {results['doctor']['GET /api/appointments']['status']} {'✓' if results['doctor']['GET /api/appointments']['success'] else '✗'}")
    
    if appointment_id:
        results["doctor"]["GET /api/appointments/:id"] = test_appointments_get(doctor_token, appointment_id)
        print(f"GET /api/appointments/:id: {results['doctor']['GET /api/appointments/:id']['status']} {'✓' if results['doctor']['GET /api/appointments/:id']['success'] else '✗'}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    
    return results

if __name__ == "__main__":
    results = run_tests()
    
    # Save results to file
    with open("test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\n✓ Results saved to test_results.json")
