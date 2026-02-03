from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, extract
from typing import Optional, List
from datetime import date, datetime, timedelta
from app.database import get_db
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.cancellation import Cancellation
from app.models.owner import (
    OwnerMetrics, VoiceAILog, AutomationRule, 
    AutomationExecution, ClinicSettings, DoctorCapacity
)
from app.api.deps import get_current_user, require_owner, require_owner_admin_or_doctor
from app.models.user import User
from app.schemas.owner import (
    OwnerDashboardResponse, HeroMetric, NoShowByDoctor, NoShowByVisitType,
    NoShowByDayOfWeek, FollowUpData, AdminEfficiency, DoctorCapacitySummary,
    AIPerformance, VoiceAILogResponse, VoiceAILogCreate, VoiceAILogUpdate,
    VoiceAIStatsResponse, VoiceAIStats, AutomationRuleResponse, AutomationRuleCreate,
    AutomationRuleUpdate, AutomationExecutionResponse, ClinicSettingsResponse,
    ClinicSettingsUpdate, DoctorCapacityResponse, OwnerMetricsResponse, TrendDataPoint
)
import uuid

router = APIRouter(prefix="/api/owner", tags=["owner"])


def require_owner_or_admin(current_user: User = Depends(get_current_user)):
    """Allow owner or admin access"""
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Owner or Admin access required"
        )
    return current_user


@router.get("/dashboard", response_model=OwnerDashboardResponse)
def get_owner_dashboard(
    date_param: Optional[date] = Query(None, alias="date"),
    period: str = Query("week", description="week, month, quarter"),
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get owner dashboard with comprehensive metrics"""
    if date_param is None:
        date_param = date.today()
    
    # Calculate date range based on period
    if period == "week":
        start_date = date_param - timedelta(days=7)
    elif period == "month":
        start_date = date_param - timedelta(days=30)
    elif period == "quarter":
        start_date = date_param - timedelta(days=90)
    else:
        start_date = date_param - timedelta(days=7)
    
    # Get all appointments in the period
    appointments = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= start_date,
        Appointment.date <= date_param
    ).all()
    
    # Get previous period for comparison
    prev_start = start_date - (date_param - start_date)
    prev_end = start_date - timedelta(days=1)
    prev_appointments = db.query(Appointment).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= prev_start,
        Appointment.date <= prev_end
    ).all()
    
    # Calculate metrics
    total_appointments = len([a for a in appointments if a.status != "cancelled"])
    prev_total = len([a for a in prev_appointments if a.status != "cancelled"])
    
    no_shows = len([a for a in appointments if a.status == "no-show"])
    prev_no_shows = len([a for a in prev_appointments if a.status == "no-show"])
    
    no_show_rate = (no_shows / total_appointments * 100) if total_appointments > 0 else 0
    prev_no_show_rate = (prev_no_shows / prev_total * 100) if prev_total > 0 else 0
    
    # Get Voice AI logs for the period
    voice_logs = db.query(VoiceAILog).filter(
        VoiceAILog.clinic_id == current_user.clinic_id,
        VoiceAILog.created_at >= datetime.combine(start_date, datetime.min.time()),
        VoiceAILog.created_at <= datetime.combine(date_param, datetime.max.time())
    ).all()
    
    # Calculate AI recovered appointments
    recovered = len([v for v in voice_logs if v.outcome in ["confirmed", "rescheduled"]])
    prev_voice_logs = db.query(VoiceAILog).filter(
        VoiceAILog.clinic_id == current_user.clinic_id,
        VoiceAILog.created_at >= datetime.combine(prev_start, datetime.min.time()),
        VoiceAILog.created_at <= datetime.combine(prev_end, datetime.max.time())
    ).all()
    prev_recovered = len([v for v in prev_voice_logs if v.outcome in ["confirmed", "rescheduled"]])
    
    # Calculate admin efficiency (based on automated actions)
    calls_automated = len([v for v in voice_logs if v.status == "completed"])
    forms_auto_completed = len([a for a in appointments if a.intake_status == "completed"])
    manual_tasks_avoided = calls_automated + forms_auto_completed
    hours_saved = (calls_automated * 5 + forms_auto_completed * 10) / 60  # 5 min per call, 10 min per form
    
    # Previous period admin efficiency for comparison
    prev_calls = len([v for v in prev_voice_logs if v.status == "completed"])
    prev_forms = len([a for a in prev_appointments if a.intake_status == "completed"])
    
    # Get doctors for capacity (needed for both current and previous period calculations)
    doctors = db.query(Doctor).filter(Doctor.clinic_id == current_user.clinic_id).all()
    
    # Previous period utilization
    prev_total_slots = len(doctors) * 16 * 7
    prev_total_booked = len([a for a in prev_appointments if a.status != "cancelled"])
    prev_utilization = (prev_total_booked / prev_total_slots * 100) if prev_total_slots > 0 else 0
    
    # Calculate utilization per doctor
    doctor_capacity_list = []
    for doctor in doctors:
        doc_appointments = [a for a in appointments if str(a.doctor_id) == str(doctor.id) and a.status != "cancelled"]
        total_slots = 16 * 7  # 16 slots per day * 7 days
        booked = len(doc_appointments)
        utilization = (booked / total_slots * 100) if total_slots > 0 else 0
        
        doctor_capacity_list.append(DoctorCapacitySummary(
            doctor_id=str(doctor.id),
            doctor=doctor.name,
            appointments=booked,
            utilization=round(utilization, 1),
            specialty=doctor.specialty or "General"
        ))
    
    # Calculate overall clinic utilization
    total_slots = len(doctors) * 16 * 7
    total_booked = len([a for a in appointments if a.status != "cancelled"])
    clinic_utilization = (total_booked / total_slots * 100) if total_slots > 0 else 0
    
    # No-show by doctor
    no_show_by_doctor = []
    for doctor in doctors:
        doc_appointments = [a for a in appointments if str(a.doctor_id) == str(doctor.id)]
        doc_total = len([a for a in doc_appointments if a.status != "cancelled"])
        doc_no_shows = len([a for a in doc_appointments if a.status == "no-show"])
        doc_rate = (doc_no_shows / doc_total * 100) if doc_total > 0 else 0
        
        no_show_by_doctor.append(NoShowByDoctor(
            doctor_id=str(doctor.id),
            doctor=doctor.name,
            rate=round(doc_rate, 1),
            appointments=doc_total
        ))
    
    # No-show by visit type
    in_clinic = [a for a in appointments if a.visit_type == "in-clinic"]
    virtual = [a for a in appointments if a.visit_type == "virtual"]
    
    in_clinic_total = len([a for a in in_clinic if a.status != "cancelled"])
    in_clinic_no_show = len([a for a in in_clinic if a.status == "no-show"])
    virtual_total = len([a for a in virtual if a.status != "cancelled"])
    virtual_no_show = len([a for a in virtual if a.status == "no-show"])
    
    no_show_by_visit_type = [
        NoShowByVisitType(
            type="In-Clinic",
            rate=round((in_clinic_no_show / in_clinic_total * 100) if in_clinic_total > 0 else 0, 1),
            appointments=in_clinic_total
        ),
        NoShowByVisitType(
            type="Video Call",
            rate=round((virtual_no_show / virtual_total * 100) if virtual_total > 0 else 0, 1),
            appointments=virtual_total
        )
    ]
    
    # No-show by day of week
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    no_show_by_day = []
    for i, day in enumerate(days):
        day_appointments = [a for a in appointments if a.date.weekday() == i]
        day_total = len([a for a in day_appointments if a.status != "cancelled"])
        day_no_shows = len([a for a in day_appointments if a.status == "no-show"])
        day_rate = (day_no_shows / day_total * 100) if day_total > 0 else 0
        
        no_show_by_day.append(NoShowByDayOfWeek(
            day=day,
            rate=round(day_rate, 1)
        ))
    
    # Follow-up data
    follow_ups = [a for a in appointments if a.visit_category == "follow-up"]
    follow_up_scheduled = len(follow_ups)
    follow_up_completed = len([a for a in follow_ups if a.status == "completed"])
    follow_up_missed = len([a for a in follow_ups if a.status in ["no-show", "cancelled"]])
    
    follow_up_data = FollowUpData(
        scheduled=follow_up_scheduled,
        completed=follow_up_completed,
        missed=follow_up_missed,
        completion_rate=round((follow_up_completed / follow_up_scheduled * 100) if follow_up_scheduled > 0 else 0, 1),
        retention_impact=f"+{round(follow_up_completed / max(follow_up_scheduled, 1) * 23, 0)}% patient return rate vs manual scheduling"
    )
    
    # Admin efficiency
    hourly_rate = 50  # $50/hr for admin
    cost_savings = hours_saved * hourly_rate
    admin_efficiency = AdminEfficiency(
        calls_automated=calls_automated,
        forms_auto_completed=forms_auto_completed,
        manual_tasks_avoided=manual_tasks_avoided,
        hours_per_week=round(hours_saved, 1),
        cost_savings=f"${round(cost_savings):,}",
        cost_savings_monthly=f"${round(cost_savings * 4):,}"
    )
    
    # AI Performance
    total_interactions = len(voice_logs)
    confirmations = len([v for v in voice_logs if v.outcome == "confirmed"])
    escalations = len([v for v in voice_logs if v.escalated])
    success_rate = (confirmations / total_interactions * 100) if total_interactions > 0 else 0
    avg_duration = sum(v.duration_seconds for v in voice_logs) / len(voice_logs) if voice_logs else 0
    
    ai_performance = AIPerformance(
        total_interactions=total_interactions,
        confirmations_achieved=confirmations,
        escalations_to_humans=escalations,
        success_rate=round(success_rate, 1),
        avg_resolution_time=f"{int(avg_duration // 60)}m {int(avg_duration % 60)}s"
    )
    
    # Build hero metrics
    no_show_change = prev_no_show_rate - no_show_rate  # Positive = improvement
    recovered_change = recovered - prev_recovered
    
    hero_metrics = [
        HeroMetric(
            id="no-show-rate",
            label="No-Show Rate",
            value=f"{round(no_show_rate, 1)}%",
            change=round(no_show_change, 0),
            change_label=f"{abs(round(no_show_change, 0))}% {'reduction' if no_show_change > 0 else 'increase'}",
            trend="down" if no_show_rate < prev_no_show_rate else "up",
            good_direction="down"
        ),
        HeroMetric(
            id="appointments-recovered",
            label="Appointments Recovered by AI",
            value=str(recovered),
            change=float(recovered_change),
            change_label=f"{abs(recovered_change)} {'more' if recovered_change >= 0 else 'less'} vs last period",
            trend="up" if recovered_change >= 0 else "down",
            good_direction="up"
        ),
        HeroMetric(
            id="admin-hours-saved",
            label="Admin Hours Saved",
            value=f"{round(hours_saved, 1)} hrs",
            change=round(((hours_saved - (prev_calls * 5 + prev_forms * 10) / 60) / max((prev_calls * 5 + prev_forms * 10) / 60, 1)) * 100, 0) if prev_calls + prev_forms > 0 else 0.0,
            change_label=f"{round(((hours_saved - (prev_calls * 5 + prev_forms * 10) / 60) / max((prev_calls * 5 + prev_forms * 10) / 60, 1)) * 100, 0)}% {'more' if hours_saved > (prev_calls * 5 + prev_forms * 10) / 60 else 'less'} efficient" if prev_calls + prev_forms > 0 else "0% change",
            trend="up" if hours_saved >= (prev_calls * 5 + prev_forms * 10) / 60 else "down",
            good_direction="up"
        ),
        HeroMetric(
            id="clinic-utilization",
            label="Clinic Utilization",
            value=f"{round(clinic_utilization, 0)}%",
            change=round(clinic_utilization - prev_utilization, 0) if prev_utilization > 0 else 0.0,
            change_label=f"{abs(round(clinic_utilization - prev_utilization, 0))}% {'increase' if clinic_utilization > prev_utilization else 'decrease'}" if prev_utilization > 0 else "0% change",
            trend="up" if clinic_utilization >= prev_utilization else "down",
            good_direction="up"
        )
    ]
    
    # ROI Summary
    roi_summary = {
        "appointments_recovered_weekly": recovered,
        "monthly_cost_savings": cost_savings * 4,
        "message": f"Clinicflow is recovering {recovered} appointments per week and saving ${round(cost_savings * 4):,}/month in admin costs"
    }
    
    # Calculate historical trends (last 6 weeks for weekly view)
    no_show_trend = []
    appointments_recovered_trend = []
    admin_hours_trend = []
    clinic_utilization_trend = []
    
    if period == "week":
        # Get weekly trends for last 6 weeks
        for week_offset in range(5, -1, -1):
            week_start = date_param - timedelta(days=7 * (week_offset + 1))
            week_end = date_param - timedelta(days=7 * week_offset)
            
            week_appointments = db.query(Appointment).filter(
                Appointment.clinic_id == current_user.clinic_id,
                Appointment.date >= week_start,
                Appointment.date < week_end
            ).all()
            
            week_total = len([a for a in week_appointments if a.status != "cancelled"])
            week_no_shows = len([a for a in week_appointments if a.status == "no-show"])
            week_no_show_rate = (week_no_shows / week_total * 100) if week_total > 0 else 0
            
            week_voice_logs = db.query(VoiceAILog).filter(
                VoiceAILog.clinic_id == current_user.clinic_id,
                VoiceAILog.created_at >= datetime.combine(week_start, datetime.min.time()),
                VoiceAILog.created_at < datetime.combine(week_end, datetime.max.time())
            ).all()
            week_recovered = len([v for v in week_voice_logs if v.outcome in ["confirmed", "rescheduled"]])
            
            week_calls = len([v for v in week_voice_logs if v.status == "completed"])
            week_forms = len([a for a in week_appointments if a.intake_status == "completed"])
            week_hours = (week_calls * 5 + week_forms * 10) / 60
            
            week_slots = len(doctors) * 16 * 7
            week_booked = len([a for a in week_appointments if a.status != "cancelled"])
            week_utilization = (week_booked / week_slots * 100) if week_slots > 0 else 0
            
            week_label = f"Week {6 - week_offset}" if week_offset > 0 else "Current Week"
            
            no_show_trend.append(TrendDataPoint(label=week_label, value=round(week_no_show_rate, 1)))
            appointments_recovered_trend.append(TrendDataPoint(label=week_label, value=week_recovered))
            admin_hours_trend.append(TrendDataPoint(label=week_label, value=round(week_hours, 1)))
            clinic_utilization_trend.append(TrendDataPoint(label=week_label, value=round(week_utilization, 0)))
    
    # Calculate recovery sources breakdown
    same_day_cancellations = len([v for v in voice_logs if v.call_type == "cancellation_fill" and v.outcome in ["confirmed", "rescheduled"]])
    waitlist_outreach = len([v for v in voice_logs if v.call_type == "waitlist_outreach" and v.outcome in ["confirmed", "rescheduled"]])
    unconfirmed_converted = len([v for v in voice_logs if v.call_type == "confirmation" and v.outcome == "confirmed"])
    
    recovery_sources = {
        "same_day_cancellations": same_day_cancellations,
        "waitlist_outreach": waitlist_outreach,
        "unconfirmed_converted": unconfirmed_converted
    }
    
    # Get pre-clinicflow baseline (from OwnerMetrics if available, or calculate from historical data)
    # For now, use a calculated baseline from 30 days before clinicflow implementation
    baseline_date = date_param - timedelta(days=60)
    baseline_appointments = db.query(Appointment).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= baseline_date - timedelta(days=30),
        Appointment.date < baseline_date
    ).all()
    baseline_total = len([a for a in baseline_appointments if a.status != "cancelled"])
    baseline_no_shows = len([a for a in baseline_appointments if a.status == "no-show"])
    pre_clinicflow_no_show_rate = (baseline_no_shows / baseline_total * 100) if baseline_total > 0 else 10.2
    
    return OwnerDashboardResponse(
        date=date_param.isoformat(),
        hero_metrics=hero_metrics,
        no_show_by_doctor=no_show_by_doctor,
        no_show_by_visit_type=no_show_by_visit_type,
        no_show_by_day_of_week=no_show_by_day,
        follow_up_data=follow_up_data,
        admin_efficiency=admin_efficiency,
        doctor_capacity=doctor_capacity_list,
        ai_performance=ai_performance,
        roi_summary=roi_summary,
        no_show_trend=no_show_trend if period == "week" else None,
        appointments_recovered_trend=appointments_recovered_trend if period == "week" else None,
        admin_hours_trend=admin_hours_trend if period == "week" else None,
        clinic_utilization_trend=clinic_utilization_trend if period == "week" else None,
        recovery_sources=recovery_sources,
        pre_clinicflow_no_show_rate=round(pre_clinicflow_no_show_rate, 1)
    )


# Voice AI Endpoints
@router.get("/voice-ai/logs", response_model=List[VoiceAILogResponse])
def get_voice_ai_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    call_type: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get voice AI call logs"""
    query = db.query(VoiceAILog).filter(
        VoiceAILog.clinic_id == current_user.clinic_id
    )
    
    if status:
        query = query.filter(VoiceAILog.status == status)
    if call_type:
        query = query.filter(VoiceAILog.call_type == call_type)
    if date_from:
        query = query.filter(VoiceAILog.created_at >= datetime.combine(date_from, datetime.min.time()))
    if date_to:
        query = query.filter(VoiceAILog.created_at <= datetime.combine(date_to, datetime.max.time()))
    
    logs = query.order_by(VoiceAILog.created_at.desc()).offset(skip).limit(limit).all()
    
    return [VoiceAILogResponse(
        id=str(log.id),
        clinic_id=str(log.clinic_id),
        appointment_id=str(log.appointment_id) if log.appointment_id else None,
        patient_id=str(log.patient_id) if log.patient_id else None,
        call_sid=log.call_sid,
        call_type=log.call_type,
        direction=log.direction,
        status=log.status,
        outcome=log.outcome,
        initiated_at=log.initiated_at,
        answered_at=log.answered_at,
        ended_at=log.ended_at,
        duration_seconds=log.duration_seconds,
        transcript=log.transcript,
        escalated=log.escalated,
        escalation_reason=log.escalation_reason,
        from_number=log.from_number,
        to_number=log.to_number,
        created_at=log.created_at
    ) for log in logs]


@router.get("/voice-ai/stats", response_model=VoiceAIStatsResponse)
def get_voice_ai_stats(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get voice AI statistics"""
    if date_from is None:
        date_from = date.today() - timedelta(days=7)
    if date_to is None:
        date_to = date.today()
    
    logs = db.query(VoiceAILog).filter(
        VoiceAILog.clinic_id == current_user.clinic_id,
        VoiceAILog.created_at >= datetime.combine(date_from, datetime.min.time()),
        VoiceAILog.created_at <= datetime.combine(date_to, datetime.max.time())
    ).all()
    
    total = len(logs)
    successful = len([l for l in logs if l.status == "completed" and l.outcome in ["confirmed", "rescheduled"]])
    failed = len([l for l in logs if l.status == "failed"])
    escalated = len([l for l in logs if l.escalated])
    confirmations = len([l for l in logs if l.outcome == "confirmed"])
    avg_duration = sum(l.duration_seconds for l in logs) / len(logs) if logs else 0
    success_rate = (successful / total * 100) if total > 0 else 0
    
    # Get recent calls
    recent = db.query(VoiceAILog).filter(
        VoiceAILog.clinic_id == current_user.clinic_id
    ).order_by(VoiceAILog.created_at.desc()).limit(10).all()
    
    return VoiceAIStatsResponse(
        date_range={"from": date_from.isoformat(), "to": date_to.isoformat()},
        stats=VoiceAIStats(
            total_calls=total,
            successful_calls=successful,
            failed_calls=failed,
            escalated_calls=escalated,
            avg_duration_seconds=round(avg_duration, 1),
            confirmations_achieved=confirmations,
            success_rate=round(success_rate, 1)
        ),
        recent_calls=[VoiceAILogResponse(
            id=str(log.id),
            clinic_id=str(log.clinic_id),
            appointment_id=str(log.appointment_id) if log.appointment_id else None,
            patient_id=str(log.patient_id) if log.patient_id else None,
            call_sid=log.call_sid,
            call_type=log.call_type,
            direction=log.direction,
            status=log.status,
            outcome=log.outcome,
            initiated_at=log.initiated_at,
            answered_at=log.answered_at,
            ended_at=log.ended_at,
            duration_seconds=log.duration_seconds,
            transcript=log.transcript,
            escalated=log.escalated,
            escalation_reason=log.escalation_reason,
            from_number=log.from_number,
            to_number=log.to_number,
            created_at=log.created_at
        ) for log in recent]
    )


@router.post("/voice-ai/logs", response_model=VoiceAILogResponse, status_code=status.HTTP_201_CREATED)
def create_voice_ai_log(
    log_data: VoiceAILogCreate,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Create a voice AI log entry"""
    log = VoiceAILog(
        clinic_id=current_user.clinic_id,
        appointment_id=uuid.UUID(log_data.appointment_id) if log_data.appointment_id else None,
        patient_id=uuid.UUID(log_data.patient_id) if log_data.patient_id else None,
        call_type=log_data.call_type,
        direction=log_data.direction,
        status=log_data.status,
        outcome=log_data.outcome,
        to_number=log_data.to_number
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return VoiceAILogResponse(
        id=str(log.id),
        clinic_id=str(log.clinic_id),
        appointment_id=str(log.appointment_id) if log.appointment_id else None,
        patient_id=str(log.patient_id) if log.patient_id else None,
        call_sid=log.call_sid,
        call_type=log.call_type,
        direction=log.direction,
        status=log.status,
        outcome=log.outcome,
        initiated_at=log.initiated_at,
        answered_at=log.answered_at,
        ended_at=log.ended_at,
        duration_seconds=log.duration_seconds,
        transcript=log.transcript,
        escalated=log.escalated,
        escalation_reason=log.escalation_reason,
        from_number=log.from_number,
        to_number=log.to_number,
        created_at=log.created_at
    )


@router.put("/voice-ai/logs/{log_id}", response_model=VoiceAILogResponse)
def update_voice_ai_log(
    log_id: str,
    log_data: VoiceAILogUpdate,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Update a voice AI log entry"""
    log = db.query(VoiceAILog).filter(
        VoiceAILog.id == uuid.UUID(log_id),
        VoiceAILog.clinic_id == current_user.clinic_id
    ).first()
    
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log not found")
    
    update_data = log_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)
    
    db.commit()
    db.refresh(log)
    
    return VoiceAILogResponse(
        id=str(log.id),
        clinic_id=str(log.clinic_id),
        appointment_id=str(log.appointment_id) if log.appointment_id else None,
        patient_id=str(log.patient_id) if log.patient_id else None,
        call_sid=log.call_sid,
        call_type=log.call_type,
        direction=log.direction,
        status=log.status,
        outcome=log.outcome,
        initiated_at=log.initiated_at,
        answered_at=log.answered_at,
        ended_at=log.ended_at,
        duration_seconds=log.duration_seconds,
        transcript=log.transcript,
        escalated=log.escalated,
        escalation_reason=log.escalation_reason,
        from_number=log.from_number,
        to_number=log.to_number,
        created_at=log.created_at
    )


# Automation Rules Endpoints
@router.get("/automation/rules", response_model=List[AutomationRuleResponse])
def get_automation_rules(
    rule_type: Optional[str] = None,
    enabled: Optional[bool] = None,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get all automation rules"""
    query = db.query(AutomationRule).filter(
        AutomationRule.clinic_id == current_user.clinic_id
    )
    
    if rule_type:
        query = query.filter(AutomationRule.rule_type == rule_type)
    if enabled is not None:
        query = query.filter(AutomationRule.enabled == enabled)
    
    rules = query.order_by(AutomationRule.priority.desc()).all()
    
    return [AutomationRuleResponse(
        id=str(rule.id),
        clinic_id=str(rule.clinic_id),
        name=rule.name,
        description=rule.description,
        rule_type=rule.rule_type,
        trigger_event=rule.trigger_event,
        trigger_conditions=rule.trigger_conditions or {},
        action_type=rule.action_type,
        action_config=rule.action_config or {},
        enabled=rule.enabled,
        priority=rule.priority,
        times_triggered=rule.times_triggered,
        last_triggered_at=rule.last_triggered_at,
        success_count=rule.success_count,
        failure_count=rule.failure_count,
        created_at=rule.created_at,
        updated_at=rule.updated_at
    ) for rule in rules]


@router.post("/automation/rules", response_model=AutomationRuleResponse, status_code=status.HTTP_201_CREATED)
def create_automation_rule(
    rule_data: AutomationRuleCreate,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Create an automation rule"""
    rule = AutomationRule(
        clinic_id=current_user.clinic_id,
        name=rule_data.name,
        description=rule_data.description,
        rule_type=rule_data.rule_type,
        trigger_event=rule_data.trigger_event,
        trigger_conditions=rule_data.trigger_conditions,
        action_type=rule_data.action_type,
        action_config=rule_data.action_config,
        enabled=rule_data.enabled,
        priority=rule_data.priority
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    
    return AutomationRuleResponse(
        id=str(rule.id),
        clinic_id=str(rule.clinic_id),
        name=rule.name,
        description=rule.description,
        rule_type=rule.rule_type,
        trigger_event=rule.trigger_event,
        trigger_conditions=rule.trigger_conditions or {},
        action_type=rule.action_type,
        action_config=rule.action_config or {},
        enabled=rule.enabled,
        priority=rule.priority,
        times_triggered=rule.times_triggered,
        last_triggered_at=rule.last_triggered_at,
        success_count=rule.success_count,
        failure_count=rule.failure_count,
        created_at=rule.created_at,
        updated_at=rule.updated_at
    )


@router.get("/automation/rules/{rule_id}", response_model=AutomationRuleResponse)
def get_automation_rule(
    rule_id: str,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get a specific automation rule"""
    rule = db.query(AutomationRule).filter(
        AutomationRule.id == uuid.UUID(rule_id),
        AutomationRule.clinic_id == current_user.clinic_id
    ).first()
    
    if not rule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
    
    return AutomationRuleResponse(
        id=str(rule.id),
        clinic_id=str(rule.clinic_id),
        name=rule.name,
        description=rule.description,
        rule_type=rule.rule_type,
        trigger_event=rule.trigger_event,
        trigger_conditions=rule.trigger_conditions or {},
        action_type=rule.action_type,
        action_config=rule.action_config or {},
        enabled=rule.enabled,
        priority=rule.priority,
        times_triggered=rule.times_triggered,
        last_triggered_at=rule.last_triggered_at,
        success_count=rule.success_count,
        failure_count=rule.failure_count,
        created_at=rule.created_at,
        updated_at=rule.updated_at
    )


@router.put("/automation/rules/{rule_id}", response_model=AutomationRuleResponse)
def update_automation_rule(
    rule_id: str,
    rule_data: AutomationRuleUpdate,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Update an automation rule"""
    rule = db.query(AutomationRule).filter(
        AutomationRule.id == uuid.UUID(rule_id),
        AutomationRule.clinic_id == current_user.clinic_id
    ).first()
    
    if not rule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
    
    update_data = rule_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rule, field, value)
    
    db.commit()
    db.refresh(rule)
    
    return AutomationRuleResponse(
        id=str(rule.id),
        clinic_id=str(rule.clinic_id),
        name=rule.name,
        description=rule.description,
        rule_type=rule.rule_type,
        trigger_event=rule.trigger_event,
        trigger_conditions=rule.trigger_conditions or {},
        action_type=rule.action_type,
        action_config=rule.action_config or {},
        enabled=rule.enabled,
        priority=rule.priority,
        times_triggered=rule.times_triggered,
        last_triggered_at=rule.last_triggered_at,
        success_count=rule.success_count,
        failure_count=rule.failure_count,
        created_at=rule.created_at,
        updated_at=rule.updated_at
    )


@router.delete("/automation/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_automation_rule(
    rule_id: str,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Delete an automation rule"""
    rule = db.query(AutomationRule).filter(
        AutomationRule.id == uuid.UUID(rule_id),
        AutomationRule.clinic_id == current_user.clinic_id
    ).first()
    
    if not rule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
    
    db.delete(rule)
    db.commit()
    return None


@router.get("/automation/executions", response_model=List[AutomationExecutionResponse])
def get_automation_executions(
    rule_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get automation execution history"""
    query = db.query(AutomationExecution).filter(
        AutomationExecution.clinic_id == current_user.clinic_id
    )
    
    if rule_id:
        query = query.filter(AutomationExecution.rule_id == uuid.UUID(rule_id))
    if status_filter:
        query = query.filter(AutomationExecution.status == status_filter)
    
    executions = query.order_by(AutomationExecution.triggered_at.desc()).offset(skip).limit(limit).all()
    
    return [AutomationExecutionResponse(
        id=str(ex.id),
        clinic_id=str(ex.clinic_id),
        rule_id=str(ex.rule_id),
        appointment_id=str(ex.appointment_id) if ex.appointment_id else None,
        patient_id=str(ex.patient_id) if ex.patient_id else None,
        status=ex.status,
        result=ex.result or {},
        error_message=ex.error_message,
        triggered_at=ex.triggered_at,
        completed_at=ex.completed_at
    ) for ex in executions]


# Settings Endpoints
@router.get("/settings", response_model=ClinicSettingsResponse)
def get_clinic_settings(
    current_user: User = Depends(require_owner_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get clinic settings"""
    settings = db.query(ClinicSettings).filter(
        ClinicSettings.clinic_id == current_user.clinic_id
    ).first()
    
    if not settings:
        # Create default settings if none exist
        settings = ClinicSettings(clinic_id=current_user.clinic_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return ClinicSettingsResponse(
        id=str(settings.id),
        clinic_id=str(settings.clinic_id),
        working_hours=settings.working_hours,
        default_appointment_duration=settings.default_appointment_duration,
        buffer_between_appointments=settings.buffer_between_appointments,
        max_appointments_per_day=settings.max_appointments_per_day,
        confirmation_reminder_hours=settings.confirmation_reminder_hours,
        intake_reminder_hours=settings.intake_reminder_hours,
        follow_up_reminder_days=settings.follow_up_reminder_days,
        voice_ai_enabled=settings.voice_ai_enabled,
        voice_ai_auto_confirm=settings.voice_ai_auto_confirm,
        voice_ai_escalation_enabled=settings.voice_ai_escalation_enabled,
        sms_enabled=settings.sms_enabled,
        sms_confirmation_enabled=settings.sms_confirmation_enabled,
        sms_reminder_enabled=settings.sms_reminder_enabled,
        email_enabled=settings.email_enabled,
        email_confirmation_enabled=settings.email_confirmation_enabled,
        email_reminder_enabled=settings.email_reminder_enabled,
        waitlist_enabled=settings.waitlist_enabled,
        auto_fill_cancellations=settings.auto_fill_cancellations,
        timezone=settings.timezone,
        date_format=settings.date_format,
        time_format=settings.time_format,
        created_at=settings.created_at,
        updated_at=settings.updated_at
    )


@router.put("/settings", response_model=ClinicSettingsResponse)
def update_clinic_settings(
    settings_data: ClinicSettingsUpdate,
    current_user: User = Depends(require_owner_or_admin),  # Only owner/admin can update
    db: Session = Depends(get_db)
):
    """Update clinic settings"""
    import logging
    logger = logging.getLogger(__name__)
    
    settings = db.query(ClinicSettings).filter(
        ClinicSettings.clinic_id == current_user.clinic_id
    ).first()
    
    if not settings:
        settings = ClinicSettings(clinic_id=current_user.clinic_id)
        db.add(settings)
    
    update_data = settings_data.model_dump(exclude_unset=True)
    logger.info(f"Updating clinic settings: {update_data}")
    
    # Log appointment settings specifically
    if 'default_appointment_duration' in update_data:
        logger.info(f"Setting default_appointment_duration to {update_data['default_appointment_duration']}")
    if 'buffer_between_appointments' in update_data:
        logger.info(f"Setting buffer_between_appointments to {update_data['buffer_between_appointments']}")
    if 'max_appointments_per_day' in update_data:
        logger.info(f"Setting max_appointments_per_day to {update_data['max_appointments_per_day']}")
    
    # Log general settings
    if 'timezone' in update_data:
        logger.info(f"Setting timezone to {update_data['timezone']}")
    if 'time_format' in update_data:
        logger.info(f"Setting time_format to {update_data['time_format']}")
    if 'date_format' in update_data:
        logger.info(f"Setting date_format to {update_data['date_format']}")
    
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    
    logger.info(f"Settings updated successfully. General: timezone={settings.timezone}, time_format={settings.time_format}, date_format={settings.date_format}")
    
    return ClinicSettingsResponse(
        id=str(settings.id),
        clinic_id=str(settings.clinic_id),
        working_hours=settings.working_hours,
        default_appointment_duration=settings.default_appointment_duration,
        buffer_between_appointments=settings.buffer_between_appointments,
        max_appointments_per_day=settings.max_appointments_per_day,
        confirmation_reminder_hours=settings.confirmation_reminder_hours,
        intake_reminder_hours=settings.intake_reminder_hours,
        follow_up_reminder_days=settings.follow_up_reminder_days,
        voice_ai_enabled=settings.voice_ai_enabled,
        voice_ai_auto_confirm=settings.voice_ai_auto_confirm,
        voice_ai_escalation_enabled=settings.voice_ai_escalation_enabled,
        sms_enabled=settings.sms_enabled,
        sms_confirmation_enabled=settings.sms_confirmation_enabled,
        sms_reminder_enabled=settings.sms_reminder_enabled,
        email_enabled=settings.email_enabled,
        email_confirmation_enabled=settings.email_confirmation_enabled,
        email_reminder_enabled=settings.email_reminder_enabled,
        waitlist_enabled=settings.waitlist_enabled,
        auto_fill_cancellations=settings.auto_fill_cancellations,
        timezone=settings.timezone,
        date_format=settings.date_format,
        time_format=settings.time_format,
        created_at=settings.created_at,
        updated_at=settings.updated_at
    )


# Metrics Endpoints
@router.get("/metrics", response_model=List[OwnerMetricsResponse])
def get_owner_metrics(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get historical owner metrics"""
    if date_from is None:
        date_from = date.today() - timedelta(days=30)
    if date_to is None:
        date_to = date.today()
    
    metrics = db.query(OwnerMetrics).filter(
        OwnerMetrics.clinic_id == current_user.clinic_id,
        OwnerMetrics.date >= date_from,
        OwnerMetrics.date <= date_to
    ).order_by(OwnerMetrics.date.desc()).all()
    
    return [OwnerMetricsResponse(
        id=str(m.id),
        clinic_id=str(m.clinic_id),
        date=m.date,
        no_show_rate=m.no_show_rate,
        no_show_count=m.no_show_count,
        total_appointments=m.total_appointments,
        appointments_recovered=m.appointments_recovered,
        admin_hours_saved=m.admin_hours_saved,
        calls_automated=m.calls_automated,
        forms_auto_completed=m.forms_auto_completed,
        manual_tasks_avoided=m.manual_tasks_avoided,
        clinic_utilization=m.clinic_utilization,
        estimated_savings=m.estimated_savings,
        created_at=m.created_at,
        updated_at=m.updated_at
    ) for m in metrics]


# Doctor Capacity Endpoints
@router.get("/capacity", response_model=List[DoctorCapacityResponse])
def get_doctor_capacity(
    date_param: Optional[date] = Query(None, alias="date"),
    doctor_id: Optional[str] = None,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Get doctor capacity data"""
    if date_param is None:
        date_param = date.today()
    
    query = db.query(DoctorCapacity).options(
        joinedload(DoctorCapacity.doctor)
    ).filter(
        DoctorCapacity.clinic_id == current_user.clinic_id,
        DoctorCapacity.date == date_param
    )
    
    if doctor_id:
        query = query.filter(DoctorCapacity.doctor_id == uuid.UUID(doctor_id))
    
    capacities = query.all()
    
    # If no capacity records exist, calculate from appointments
    if not capacities:
        doctors = db.query(Doctor).filter(Doctor.clinic_id == current_user.clinic_id).all()
        result = []
        
        for doctor in doctors:
            appointments = db.query(Appointment).filter(
                Appointment.doctor_id == doctor.id,
                Appointment.date == date_param
            ).all()
            
            total_slots = 16
            booked = len([a for a in appointments if a.status != "cancelled"])
            utilization = (booked / total_slots * 100) if total_slots > 0 else 0
            
            result.append(DoctorCapacityResponse(
                id=str(uuid.uuid4()),
                clinic_id=str(current_user.clinic_id),
                doctor_id=str(doctor.id),
                doctor_name=doctor.name,
                specialty=doctor.specialty,
                date=date_param,
                total_slots=total_slots,
                booked_slots=booked,
                utilization_rate=round(utilization, 1),
                confirmed_count=len([a for a in appointments if a.status == "confirmed"]),
                unconfirmed_count=len([a for a in appointments if a.status == "unconfirmed"]),
                completed_count=len([a for a in appointments if a.status == "completed"]),
                cancelled_count=len([a for a in appointments if a.status == "cancelled"]),
                no_show_count=len([a for a in appointments if a.status == "no-show"])
            ))
        
        return result
    
    return [DoctorCapacityResponse(
        id=str(cap.id),
        clinic_id=str(cap.clinic_id),
        doctor_id=str(cap.doctor_id),
        doctor_name=cap.doctor.name if cap.doctor else None,
        specialty=cap.doctor.specialty if cap.doctor else None,
        date=cap.date,
        total_slots=cap.total_slots,
        booked_slots=cap.booked_slots,
        utilization_rate=cap.utilization_rate,
        confirmed_count=cap.confirmed_count,
        unconfirmed_count=cap.unconfirmed_count,
        completed_count=cap.completed_count,
        cancelled_count=cap.cancelled_count,
        no_show_count=cap.no_show_count
    ) for cap in capacities]
