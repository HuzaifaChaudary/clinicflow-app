"""Add invites table

Revision ID: add_invites_table
Revises: add_owner_models
Create Date: 2026-01-24

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_invites_table'
down_revision = 'add_owner_models'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create invites table
    op.create_table(
        'invites',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, index=True),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clinics.id'), nullable=False),
        sa.Column('invited_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('token', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('accepted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Create indexes
    op.create_index('ix_invites_clinic_id', 'invites', ['clinic_id'])
    op.create_index('ix_invites_status', 'invites', ['status'])


def downgrade() -> None:
    op.drop_index('ix_invites_status', table_name='invites')
    op.drop_index('ix_invites_clinic_id', table_name='invites')
    op.drop_table('invites')
