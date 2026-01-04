import json
from sqlalchemy.orm import Session
from app.models.intake import IntakeForm, AIIntakeSummary
from app.config import settings
from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

INTAKE_SUMMARY_PROMPT = """
Analyze this patient intake form and provide a concise clinical summary.

Patient Intake Data:
{intake_data}

Provide a JSON response with the following structure:
{{
  "summary_text": "2-3 sentences summarizing key points for the doctor",
  "patient_concerns": ["list", "of", "main", "complaints"],
  "medications": ["list", "of", "current", "medications"],
  "allergies": ["list", "of", "known", "allergies"],
  "key_notes": "Anything important to flag for the doctor"
}}

Be concise and focus on information most relevant for a doctor preparing to see the patient.
"""


def generate_intake_summary(intake_form_id, db: Session) -> AIIntakeSummary:
    """Generate AI summary from intake form"""
    if not client:
        raise ValueError("OpenAI API key not configured")
    
    # Get intake form
    intake_form = db.query(IntakeForm).filter(IntakeForm.id == intake_form_id).first()
    if not intake_form:
        raise ValueError("Intake form not found")
    
    # Call OpenAI
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": INTAKE_SUMMARY_PROMPT.format(
                    intake_data=json.dumps(intake_form.raw_answers, indent=2)
                )
            }],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Create or update AI summary
        ai_summary = db.query(AIIntakeSummary).filter(
            AIIntakeSummary.intake_form_id == intake_form.id
        ).first()
        
        if ai_summary:
            ai_summary.summary_text = result.get("summary_text", "")
            ai_summary.patient_concerns = result.get("patient_concerns", [])
            ai_summary.medications = result.get("medications", [])
            ai_summary.allergies = result.get("allergies", [])
            ai_summary.key_notes = result.get("key_notes")
            ai_summary.status = "generated"
        else:
            ai_summary = AIIntakeSummary(
                clinic_id=intake_form.clinic_id,
                patient_id=intake_form.patient_id,
                appointment_id=intake_form.appointment_id,
                intake_form_id=intake_form.id,
                summary_text=result.get("summary_text", ""),
                patient_concerns=result.get("patient_concerns", []),
                medications=result.get("medications", []),
                allergies=result.get("allergies", []),
                key_notes=result.get("key_notes"),
                model_version="gpt-4",
                status="generated"
            )
            db.add(ai_summary)
        
        db.commit()
        db.refresh(ai_summary)
        
        return ai_summary
        
    except Exception as e:
        # Create failed summary record
        ai_summary = db.query(AIIntakeSummary).filter(
            AIIntakeSummary.intake_form_id == intake_form.id
        ).first()
        
        if ai_summary:
            ai_summary.status = "failed"
        else:
            ai_summary = AIIntakeSummary(
                clinic_id=intake_form.clinic_id,
                patient_id=intake_form.patient_id,
                appointment_id=intake_form.appointment_id,
                intake_form_id=intake_form.id,
                summary_text="Failed to generate summary",
                patient_concerns=[],
                medications=[],
                allergies=[],
                key_notes=f"Error: {str(e)}",
                status="failed"
            )
            db.add(ai_summary)
        
        db.commit()
        raise

