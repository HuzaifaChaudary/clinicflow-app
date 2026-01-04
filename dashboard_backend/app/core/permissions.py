"""
Permissions Module

Role-based access control and permission checking.
"""

from typing import List, Optional
from app.models import User, UserRole, Doctor


# Permission definitions per role (from mvp.md and flows.md)
ROLE_PERMISSIONS = {
    UserRole.ADMIN: {
        "can_view_all_appointments": True,
        "can_create_appointments": True,
        "can_edit_appointments": True,
        "can_cancel_appointments": True,
        "can_confirm_appointments": True,
        "can_reschedule_appointments": True,
        "can_mark_arrived": True,
        "can_view_all_patients": True,
        "can_create_patients": True,
        "can_edit_patients": True,
        "can_view_patient_history": True,
        "can_manage_intake_forms": True,
        "can_send_intake": True,
        "can_mark_intake_complete": True,
        "can_view_all_ai_interactions": True,
        "can_handle_escalations": True,
        "can_configure_settings": True,
        "can_manage_users": True,
        "can_view_doctor_schedules": True,
        "can_view_cancellation_history": True,
    },
    UserRole.DOCTOR: {
        "can_view_all_appointments": False,  # Own only
        "can_create_appointments": False,
        "can_edit_appointments": False,
        "can_cancel_appointments": False,
        "can_confirm_appointments": False,
        "can_reschedule_appointments": False,
        "can_mark_arrived": False,
        "can_view_all_patients": False,  # Own only
        "can_create_patients": False,
        "can_edit_patients": False,
        "can_view_patient_history": True,  # Own patients
        "can_manage_intake_forms": False,
        "can_send_intake": False,
        "can_mark_intake_complete": False,
        "can_view_all_ai_interactions": False,  # Own patients only
        "can_handle_escalations": False,
        "can_configure_settings": False,  # Own preferences only
        "can_manage_users": False,
        "can_view_doctor_schedules": False,  # Own only
        "can_view_cancellation_history": True,  # Own patients
        "can_add_doctor_notes": True,
        "can_set_follow_up": True,
        "can_view_intake_summary": True,
    },
    UserRole.OWNER: {
        "can_view_metrics_only": True,
        "can_view_patient_pii": False,
        "can_view_appointment_details": False,
        "can_view_aggregated_data": True,
        "can_filter_by_location": True,
        "can_filter_by_time_period": True,
        # Everything else is False
    },
}


def has_permission(user: User, permission: str) -> bool:
    """Check if a user has a specific permission."""
    role_perms = ROLE_PERMISSIONS.get(user.role, {})
    return role_perms.get(permission, False)


def can_view_appointment(user: User, appointment, doctor: Optional[Doctor] = None) -> bool:
    """Check if user can view a specific appointment."""
    if user.role == UserRole.ADMIN:
        return True
    elif user.role == UserRole.DOCTOR:
        # Doctor can only view their own appointments
        if doctor and appointment.doctor_id == doctor.id:
            return True
        return False
    elif user.role == UserRole.OWNER:
        # Owner cannot view appointment details
        return False
    return False


def can_view_patient(user: User, patient, doctor: Optional[Doctor] = None) -> bool:
    """Check if user can view a specific patient."""
    if user.role == UserRole.ADMIN:
        return True
    elif user.role == UserRole.DOCTOR:
        # Doctor can only view their own patients
        if doctor:
            # Check if there's a relationship between this doctor and patient
            for rel in patient.doctor_relationships:
                if rel.doctor_id == doctor.id:
                    return True
        return False
    elif user.role == UserRole.OWNER:
        # Owner cannot view patient data
        return False
    return False


def get_allowed_fields_for_role(user: User, model_name: str) -> List[str]:
    """Get the fields a user is allowed to see for a given model."""
    if user.role == UserRole.OWNER:
        # Owner sees aggregated data only
        if model_name == "appointment":
            return ["count", "status_counts", "date_range"]
        elif model_name == "patient":
            return []  # No patient data
        return []
    
    # Admin and Doctor see all fields (Doctor is filtered by ownership elsewhere)
    return ["*"]


class PermissionDenied(Exception):
    """Exception raised when permission is denied."""
    pass


def require_permission(user: User, permission: str):
    """Raise exception if user doesn't have permission."""
    if not has_permission(user, permission):
        raise PermissionDenied(f"Permission denied: {permission}")


def require_admin(user: User):
    """Require user to be an admin."""
    if user.role != UserRole.ADMIN:
        raise PermissionDenied("Admin access required")


def require_admin_or_doctor(user: User):
    """Require user to be admin or doctor."""
    if user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise PermissionDenied("Admin or Doctor access required")
