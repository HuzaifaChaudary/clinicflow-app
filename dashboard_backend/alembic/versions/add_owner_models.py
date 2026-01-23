"""Add owner dashboard models

Revision ID: add_owner_models
Revises: 14efecf2dbb9
Create Date: 2026-01-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_owner_models'
down_revision = '14efecf2dbb9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create owner_metrics table
    op.create_table(
        'owner_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('no_show_rate', sa.Float(), default=0.0),
        sa.Column('no_show_count', sa.Integer(), default=0),
        sa.Column('total_appointments', sa.Integer(), default=0),
        sa.Column('appointments_recovered', sa.Integer(), default=0),
        sa.Column('admin_hours_saved', sa.Float(), default=0.0),
        sa.Column('calls_automated', sa.Integer(), default=0),
        sa.Column('forms_auto_completed', sa.Integer(), default=0),
        sa.Column('manual_tasks_avoided', sa.Integer(), default=0),
        sa.Column('clinic_utilization', sa.Float(), default=0.0),
        sa.Column('estimated_savings', sa.Float(), default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create voice_ai_logs table
    op.create_table(
        'voice_ai_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('appointments.id'), nullable=True),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('patients.id'), nullable=True),
        sa.Column('call_sid', sa.String(100), nullable=True),
        sa.Column('call_type', sa.String(50), nullable=False),
        sa.Column('direction', sa.String(20), default='outbound'),
        sa.Column('status', sa.String(50), default='pending'),
        sa.Column('outcome', sa.String(50), nullable=True),
        sa.Column('initiated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('answered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), default=0),
        sa.Column('transcript', sa.Text(), nullable=True),
        sa.Column('ai_response', sa.Text(), nullable=True),
        sa.Column('patient_response', sa.Text(), nullable=True),
        sa.Column('escalated', sa.Boolean(), default=False),
        sa.Column('escalation_reason', sa.String(255), nullable=True),
        sa.Column('from_number', sa.String(20), nullable=True),
        sa.Column('to_number', sa.String(20), nullable=True),
        sa.Column('call_metadata', postgresql.JSONB(), default={}),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create automation_rules table
    op.create_table(
        'automation_rules',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('rule_type', sa.String(50), nullable=False),
        sa.Column('trigger_event', sa.String(100), nullable=False),
        sa.Column('trigger_conditions', postgresql.JSONB(), default={}),
        sa.Column('action_type', sa.String(100), nullable=False),
        sa.Column('action_config', postgresql.JSONB(), default={}),
        sa.Column('enabled', sa.Boolean(), default=True),
        sa.Column('priority', sa.Integer(), default=0),
        sa.Column('times_triggered', sa.Integer(), default=0),
        sa.Column('last_triggered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('success_count', sa.Integer(), default=0),
        sa.Column('failure_count', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create automation_executions table
    op.create_table(
        'automation_executions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('rule_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('automation_rules.id'), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('appointments.id'), nullable=True),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('patients.id'), nullable=True),
        sa.Column('status', sa.String(50), default='pending'),
        sa.Column('result', postgresql.JSONB(), default={}),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('triggered_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Create clinic_settings table
    op.create_table(
        'clinic_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False, unique=True),
        sa.Column('working_hours', postgresql.JSONB(), default={}),
        sa.Column('default_appointment_duration', sa.Integer(), default=30),
        sa.Column('buffer_between_appointments', sa.Integer(), default=0),
        sa.Column('max_appointments_per_day', sa.Integer(), default=50),
        sa.Column('confirmation_reminder_hours', sa.Integer(), default=24),
        sa.Column('intake_reminder_hours', sa.Integer(), default=48),
        sa.Column('follow_up_reminder_days', sa.Integer(), default=7),
        sa.Column('voice_ai_enabled', sa.Boolean(), default=True),
        sa.Column('voice_ai_auto_confirm', sa.Boolean(), default=True),
        sa.Column('voice_ai_escalation_enabled', sa.Boolean(), default=True),
        sa.Column('sms_enabled', sa.Boolean(), default=True),
        sa.Column('sms_confirmation_enabled', sa.Boolean(), default=True),
        sa.Column('sms_reminder_enabled', sa.Boolean(), default=True),
        sa.Column('email_enabled', sa.Boolean(), default=True),
        sa.Column('email_confirmation_enabled', sa.Boolean(), default=True),
        sa.Column('email_reminder_enabled', sa.Boolean(), default=True),
        sa.Column('waitlist_enabled', sa.Boolean(), default=True),
        sa.Column('auto_fill_cancellations', sa.Boolean(), default=True),
        sa.Column('timezone', sa.String(50), default='America/New_York'),
        sa.Column('date_format', sa.String(20), default='MM/DD/YYYY'),
        sa.Column('time_format', sa.String(10), default='12h'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create doctor_capacity table
    op.create_table(
        'doctor_capacity',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('doctor_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('doctors.id'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('total_slots', sa.Integer(), default=16),
        sa.Column('booked_slots', sa.Integer(), default=0),
        sa.Column('utilization_rate', sa.Float(), default=0.0),
        sa.Column('confirmed_count', sa.Integer(), default=0),
        sa.Column('unconfirmed_count', sa.Integer(), default=0),
        sa.Column('completed_count', sa.Integer(), default=0),
        sa.Column('cancelled_count', sa.Integer(), default=0),
        sa.Column('no_show_count', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    
    # Create indexes
    op.create_index('idx_owner_metrics_clinic_date', 'owner_metrics', ['clinic_id', 'date'])
    op.create_index('idx_voice_ai_logs_clinic', 'voice_ai_logs', ['clinic_id'])
    op.create_index('idx_voice_ai_logs_appointment', 'voice_ai_logs', ['appointment_id'])
    op.create_index('idx_automation_rules_clinic', 'automation_rules', ['clinic_id'])
    op.create_index('idx_automation_executions_clinic', 'automation_executions', ['clinic_id'])
    op.create_index('idx_automation_executions_rule', 'automation_executions', ['rule_id'])
    op.create_index('idx_doctor_capacity_clinic_date', 'doctor_capacity', ['clinic_id', 'date'])
    op.create_index('idx_doctor_capacity_doctor_date', 'doctor_capacity', ['doctor_id', 'date'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_doctor_capacity_doctor_date')
    op.drop_index('idx_doctor_capacity_clinic_date')
    op.drop_index('idx_automation_executions_rule')
    op.drop_index('idx_automation_executions_clinic')
    op.drop_index('idx_automation_rules_clinic')
    op.drop_index('idx_voice_ai_logs_appointment')
    op.drop_index('idx_voice_ai_logs_clinic')
    op.drop_index('idx_owner_metrics_clinic_date')
    
    # Drop tables
    op.drop_table('doctor_capacity')
    op.drop_table('clinic_settings')
    op.drop_table('automation_executions')
    op.drop_table('automation_rules')
    op.drop_table('voice_ai_logs')
    op.drop_table('owner_metrics')
