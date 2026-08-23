# API Specification & Contract Document

## Project: TwinHealth — AI-Powered Digital Twin for Personalized Healthcare
**Protocol:** RESTful HTTPS / JSON  
**Base URL:** `/api/v1`  
**Authentication Scheme:** Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 1. Authentication & Identity (`/auth`)

### 1.1 Register New User
* **Endpoint:** `POST /api/v1/auth/register`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!",
  "role": "PATIENT"
}
```
* **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "jane.doe@example.com",
    "role": "PATIENT",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400
  }
}
```

### 1.2 User Login
* **Endpoint:** `POST /api/v1/auth/login`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "jane.doe@example.com",
    "role": "PATIENT",
    "has_completed_onboarding": true,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

---

## 2. Patient Profile & Onboarding (`/patients`)

### 2.1 Complete Patient Onboarding
* **Endpoint:** `POST /api/v1/patients/onboarding`
* **Access:** Authenticated (`PATIENT`)
* **Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "1994-06-15",
  "gender": "FEMALE",
  "blood_group": "O+",
  "height_cm": 168.0,
  "weight_kg": 64.5,
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1-555-0199",
  "initial_vitals": {
    "systolic_bp": 120,
    "diastolic_bp": 78,
    "heart_rate": 72,
    "spo2_percent": 98.5,
    "blood_glucose_mg_dl": 95.0
  },
  "lifestyle": {
    "sleep_duration_hours": 7.5,
    "daily_steps": 8000,
    "active_exercise_minutes": 30,
    "stress_level": 3,
    "cigarettes_smoked": 0,
    "alcohol_units": 0
  }
}
```
* **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "patient_id": "7c8e9f1a-1234-5678-abcd-ef0123456789",
    "bmi": 22.85,
    "onboarding_completed": true,
    "initial_health_score": 88.5
  }
}
```

### 2.2 Get Patient Profile & Timeline
* **Endpoint:** `GET /api/v1/patients/{patient_id}/timeline`
* **Access:** Authenticated (`PATIENT` (own) or `DOCTOR` (assigned))
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "patient_id": "7c8e9f1a-1234-5678-abcd-ef0123456789",
    "timeline_events": [
      {
        "id": "e1",
        "date": "2026-08-15T09:30:00Z",
        "type": "LAB_REPORT",
        "title": "Comprehensive Metabolic Panel",
        "summary": "Glucose slightly elevated; liver enzymes normal.",
        "badge_color": "yellow"
      },
      {
        "id": "e2",
        "date": "2026-08-01T14:00:00Z",
        "type": "DOCTOR_VISIT",
        "title": "Routine Cardiology Consultation",
        "doctor_name": "Dr. Sarah Jenkins",
        "summary": "Prescribed 30 min daily cardio; monitor BP weekly.",
        "badge_color": "blue"
      }
    ]
  }
}
```

---

## 3. Medical Records & OCR Processing (`/medical-records`)

### 3.1 Upload Medical Document
* **Endpoint:** `POST /api/v1/medical-records/upload`
* **Access:** Authenticated (`PATIENT`, `DOCTOR`)
* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  * `file`: (Binary File - PDF, JPG, PNG)
  * `record_type`: `"BLOOD_REPORT"` | `"ECG"` | `"PRESCRIPTION"` | etc.
  * `title`: `"Annual Lipid & Glucose Panel"`
  * `record_date`: `"2026-08-15"`
* **Response (202 Accepted):**
```json
{
  "status": "processing",
  "data": {
    "record_id": "3d5f8a2b-8899-4c12-b5e1-90a1b2c3d4e5",
    "title": "Annual Lipid & Glucose Panel",
    "file_url": "https://storage.twinhealth.internal/records/3d5f8a2b.pdf",
    "status": "PROCESSING",
    "message": "File uploaded. OCR and AI parsing started in background."
  }
}
```

### 3.2 Get Extracted Lab Values & Summary
* **Endpoint:** `GET /api/v1/medical-records/{record_id}/extracted`
* **Access:** Authenticated
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "record_id": "3d5f8a2b-8899-4c12-b5e1-90a1b2c3d4e5",
    "status": "EXTRACTED",
    "ai_summary": "Report indicates normal kidney profile and electrolytes. Fasting glucose is at 112 mg/dL (pre-diabetic threshold). Total cholesterol is slightly elevated at 215 mg/dL.",
    "extracted_parameters": [
      {
        "test_name": "Fasting Blood Sugar",
        "category": "Metabolic",
        "value": 112.0,
        "unit": "mg/dL",
        "reference_low": 70.0,
        "reference_high": 99.0,
        "is_abnormal": true
      },
      {
        "test_name": "Total Cholesterol",
        "category": "Lipid Panel",
        "value": 215.0,
        "unit": "mg/dL",
        "reference_low": 125.0,
        "reference_high": 200.0,
        "is_abnormal": true
      },
      {
        "test_name": "Serum Creatinine",
        "category": "Renal Panel",
        "value": 0.85,
        "unit": "mg/dL",
        "reference_low": 0.6,
        "reference_high": 1.2,
        "is_abnormal": false
      }
    ],
    "suggested_questions_for_doctor": [
      "Should I consider dietary modifications or medication for borderline cholesterol?",
      "Would a 3-month HbA1c follow-up test be advisable?"
    ]
  }
}
```

---

## 4. Digital Twin Engine & Visualization (`/digital-twin`)

### 4.1 Get Full Digital Twin State
* **Endpoint:** `GET /api/v1/digital-twin/{patient_id}`
* **Access:** Authenticated
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "patient_id": "7c8e9f1a-1234-5678-abcd-ef0123456789",
    "overall_health_score": 84.0,
    "last_updated": "2026-08-23T18:00:00Z",
    "organs": {
      "brain": {
        "status": "NORMAL",
        "score": 92,
        "risk_level": "LOW",
        "color_hex": "#10B981",
        "metrics": {"sleep_avg_hours": 7.4, "stress_index": 3, "stroke_risk_pct": 2.1}
      },
      "heart": {
        "status": "MONITORING",
        "score": 74,
        "risk_level": "MODERATE",
        "color_hex": "#F59E0B",
        "metrics": {"resting_hr": 78, "bp": "128/82", "cvd_risk_pct": 14.8}
      },
      "lungs": {
        "status": "OPTIMAL",
        "score": 96,
        "risk_level": "LOW",
        "color_hex": "#10B981",
        "metrics": {"spo2_avg": 99.0, "smoking_history": "NEVER"}
      },
      "pancreas": {
        "status": "MONITORING",
        "score": 68,
        "risk_level": "MODERATE",
        "color_hex": "#F59E0B",
        "metrics": {"fasting_glucose": 112, "diabetes_risk_pct": 18.5}
      },
      "liver": {
        "status": "OPTIMAL",
        "score": 90,
        "risk_level": "LOW",
        "color_hex": "#10B981",
        "metrics": {"alt": 22, "ast": 20}
      },
      "kidneys": {
        "status": "OPTIMAL",
        "score": 94,
        "risk_level": "LOW",
        "color_hex": "#10B981",
        "metrics": {"creatinine": 0.85, "egfr": 105}
      }
    },
    "alerts": [
      {
        "id": "alt_1",
        "severity": "WARNING",
        "organ": "pancreas",
        "message": "Fasting blood sugar trending in pre-diabetic range."
      }
    ]
  }
}
```

---

## 5. Machine Learning & Explainable AI (`/predictions`)

### 5.1 Evaluate Disease Risk (Cardiovascular / Diabetes)
* **Endpoint:** `POST /api/v1/predictions/risk-assessment`
* **Access:** Authenticated
* **Request Body:**
```json
{
  "disease_type": "CARDIOVASCULAR_DISEASE",
  "parameters": {
    "age": 45,
    "gender": "MALE",
    "systolic_bp": 138,
    "diastolic_bp": 88,
    "cholesterol_total": 220,
    "cholesterol_hdl": 42,
    "is_smoker": false,
    "is_diabetic": false,
    "bmi": 27.4
  }
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "disease_type": "CARDIOVASCULAR_DISEASE",
    "model_name": "XGBoost_Framingham_v1.0",
    "risk_probability": 0.168,
    "risk_percentage": "16.8%",
    "risk_category": "MODERATE",
    "shap_analysis": {
      "base_value": 0.082,
      "factors": [
        {"feature": "systolic_bp", "value": 138, "impact": "+0.045", "direction": "INCREASE"},
        {"feature": "cholesterol_total", "value": 220, "impact": "+0.028", "direction": "INCREASE"},
        {"feature": "bmi", "value": 27.4, "impact": "+0.015", "direction": "INCREASE"},
        {"feature": "is_smoker", "value": 0, "impact": "-0.020", "direction": "DECREASE"}
      ]
    },
    "explanation": "Your estimated 10-year cardiovascular risk is 16.8% (Moderate). The main contributing factors increasing risk are elevated systolic blood pressure (138 mmHg) and total cholesterol (220 mg/dL). Being a non-smoker significantly protects your baseline score."
  }
}
```

---

## 6. Future Health Simulator (`/simulation`)

### 6.1 Simulate Lifestyle & Biophysical Scenarios
* **Endpoint:** `POST /api/v1/simulation/what-if`
* **Access:** Authenticated
* **Request Body:**
```json
{
  "patient_id": "7c8e9f1a-1234-5678-abcd-ef0123456789",
  "hypothetical_adjustments": {
    "weight_kg_delta": -5.0,
    "daily_exercise_mins": 45,
    "sleep_hours_daily": 8.0,
    "diet_quality_score": 8
  },
  "forecast_horizon_months": 12
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "is_simulation": true,
    "disclaimer": "This is a mathematical simulation model for educational exploration, not a diagnostic guarantee.",
    "baseline_health_score": 84.0,
    "projected_health_score": 92.5,
    "baseline_cvd_risk": "16.8%",
    "projected_cvd_risk": "9.4%",
    "baseline_diabetes_risk": "18.5%",
    "projected_diabetes_risk": "8.2%",
    "projected_monthly_trend": [
      {"month": 1, "health_score": 84.5, "weight_kg": 64.0},
      {"month": 3, "health_score": 86.8, "weight_kg": 62.8},
      {"month": 6, "health_score": 89.2, "weight_kg": 61.0},
      {"month": 12, "health_score": 92.5, "weight_kg": 59.5}
    ]
  }
}
```

---

## 7. Conversational AI & RAG Assistant (`/chat`)

### 7.1 Send Query to AI Health Assistant
* **Endpoint:** `POST /api/v1/chat/message`
* **Access:** Authenticated
* **Request Body:**
```json
{
  "session_id": "5a2e1b4c-9988-7766-5544-33221100aabb",
  "message": "Can you explain why my blood glucose is flagged as yellow and what I should do?"
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message_id": "8f7e6d5c-1122-3344-5566-778899aabbcc",
    "reply": "In your blood report from August 15, 2026, your Fasting Blood Sugar was measured at 112 mg/dL. The standard normal fasting range is 70–99 mg/dL; values between 100–125 mg/dL are categorized as impaired fasting glucose (pre-diabetes).\n\nKey Recommendations:\n1. Regular moderate aerobic activity (e.g., 30 mins walking/day).\n2. Reduce refined sugars and processed carbohydrates.\n3. Discuss this finding with your doctor at your next appointment to evaluate whether an HbA1c test is recommended.\n\n*Note: This information is for educational context and does not constitute a medical diagnosis.*",
    "citations": [
      {
        "record_id": "3d5f8a2b-8899-4c12-b5e1-90a1b2c3d4e5",
        "title": "Annual Lipid & Glucose Panel",
        "extracted_date": "2026-08-15"
      }
    ]
  }
}
```
