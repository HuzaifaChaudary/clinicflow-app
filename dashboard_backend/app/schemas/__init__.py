"""
Schemas Package

Exports all Pydantic schemas for API validation.
"""

from app.schemas.user import (
    UserResponse,
    UserCreate,
    UserUpdate,
    GoogleAuthRequest,
    GoogleAuthCallback,
    SignupRequest,
    TokenResponse,
    RefreshTokenRequest,
    SessionResponse,
)

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentListResponse,
    AppointmentSearchParams,
    ScheduleGridRequest,
    ScheduleGridResponse,
    TimeSlotResponse,
    AppointmentActionRequest,
    AppointmentStatusUpdate,
    AppointmentReschedule,
    AppointmentConfirm,
    AppointmentCancel,
    AppointmentNoShow,
    AppointmentCheckIn,
)

from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientDetailResponse,
    PatientListResponse,
    PatientSearchParams,
    PatientAppointmentHistory,
    PatientCancellationHistory,
)

from app.schemas.intake import (
    IntakeFieldSchema,
    IntakeSectionSchema,
    IntakeFormTemplateCreate,
    IntakeFormTemplateUpdate,
    IntakeFormTemplateResponse,
    IntakeFormTemplateListResponse,
    IntakeSubmissionCreate,
    IntakeSubmissionResponse,
    IntakeSubmissionListResponse,
    IntakeTokenResponse,
    PublicIntakeFormResponse,
    PublicIntakeSubmission,
    IntakeSummaryResponse,
)

from app.schemas.dashboard import (
    AdminDashboardSummary,
    DoctorDashboardSummary,
    NeedsAttentionItem,
    NeedsAttentionResponse,
    DailyStatsResponse,
    AppointmentsByStatusResponse,
    AppointmentsByProviderResponse,
)

from app.schemas.doctor_note import (
    DoctorNoteCreate,
    DoctorNoteUpdate,
    DoctorNoteResponse,
    DoctorNoteListResponse,
)

from app.schemas.follow_up import (
    FollowUpCreate,
    FollowUpUpdate,
    FollowUpResponse,
    FollowUpWithPatient,
    FollowUpListResponse,
)

from app.schemas.settings import (
    ClinicSettingsUpdate,
    ClinicSettingsResponse,
    DoctorSettingsUpdate,
    DoctorSettingsResponse,
    ClinicProfileUpdate,
    ClinicProfileResponse,
    DoctorProfileUpdate,
    DoctorProfileResponse,
    UserManagementCreate,
    UserManagementUpdate,
    UserManagementResponse,
    UserManagementListResponse,
)


__all__ = [
    # User schemas
    "UserResponse",
    "UserCreate",
    "UserUpdate",
    "GoogleAuthRequest",
    "GoogleAuthCallback",
    "SignupRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "SessionResponse",
    # Appointment schemas
    "AppointmentCreate",
    "AppointmentUpdate",
    "AppointmentResponse",
    "AppointmentDetailResponse",
    "AppointmentListResponse",
    "AppointmentSearchParams",
    "ScheduleGridRequest",
    "ScheduleGridResponse",
    "TimeSlotResponse",
    "AppointmentActionRequest",
    "AppointmentStatusUpdate",
    "AppointmentReschedule",
    "AppointmentConfirm",
    "AppointmentCancel",
    "AppointmentNoShow",
    "AppointmentCheckIn",
    # Patient schemas
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "PatientDetailResponse",
    "PatientListResponse",
    "PatientSearchParams",
    "PatientAppointmentHistory",
    "PatientCancellationHistory",
    # Intake schemas
    "IntakeFieldSchema",
    "IntakeSectionSchema",
    "IntakeFormTemplateCreate",
    "IntakeFormTemplateUpdate",
    "IntakeFormTemplateResponse",
    "IntakeFormTemplateListResponse",
    "IntakeSubmissionCreate",
    "IntakeSubmissionResponse",
    "IntakeSubmissionListResponse",
    "IntakeTokenResponse",
    "PublicIntakeFormResponse",
    "PublicIntakeSubmission",
    "IntakeSummaryResponse",
    # Dashboard schemas
    "AdminDashboardSummary",
    "DoctorDashboardSummary",
    "NeedsAttentionItem",
    "NeedsAttentionResponse",
    "DailyStatsResponse",
    "AppointmentsByStatusResponse",
    "AppointmentsByProviderResponse",
    # Doctor note schemas
    "DoctorNoteCreate",
    "DoctorNoteUpdate",
    "DoctorNoteResponse",
    "DoctorNoteListResponse",
    # Follow-up schemas
    "FollowUpCreate",
    "FollowUpUpdate",
    "FollowUpResponse",
    "FollowUpWithPatient",
    "FollowUpListResponse",
    # Settings schemas
    "ClinicSettingsUpdate",
    "ClinicSettingsResponse",
    "DoctorSettingsUpdate",
    "DoctorSettingsResponse",
    "ClinicProfileUpdate",
    "ClinicProfileResponse",
    "DoctorProfileUpdate",
    "DoctorProfileResponse",
    "UserManagementCreate",
    "UserManagementUpdate",
    "UserManagementResponse",
    "UserManagementListResponse",
]
