from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, timedelta
import secrets
import uuid

from app.database import get_db
from app.models.user import User
from app.models.invite import Invite
from app.models.doctor import Doctor
from app.schemas.invite import (
    InviteCreate, 
    InviteResponse, 
    InviteListResponse,
    InviteAccept,
    InviteLimitResponse,
    BulkInviteCreate,
    BulkInviteResponse
)
from app.api.deps import get_current_user, require_owner, require_owner_or_admin
from app.services.email_service import send_invite_email
from passlib.context import CryptContext

router = APIRouter(prefix="/invites", tags=["invites"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Constants
MAX_DOCTORS_PER_CLINIC = 50
INVITE_EXPIRY_DAYS = 7


def generate_invite_token() -> str:
    """Generate a secure random token for invite links"""
    return secrets.token_urlsafe(32)


@router.get("/limits", response_model=InviteLimitResponse)
async def get_invite_limits(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """Get current invite limits for the clinic"""
    # Count current doctors in the clinic
    current_doctors = db.query(User).filter(
        User.clinic_id == current_user.clinic_id,
        User.role == "doctor",
        User.status == "active"
    ).count()
    
    # Count pending doctor invites
    pending_invites = db.query(Invite).filter(
        Invite.clinic_id == current_user.clinic_id,
        Invite.role == "doctor",
        Invite.status == "pending"
    ).count()
    
    total_committed = current_doctors + pending_invites
    remaining = MAX_DOCTORS_PER_CLINIC - total_committed
    
    return InviteLimitResponse(
        current_doctors=current_doctors,
        max_doctors=MAX_DOCTORS_PER_CLINIC,
        remaining_slots=max(0, remaining),
        can_invite=remaining > 0
    )


@router.get("", response_model=InviteListResponse)
async def list_invites(
    status_filter: Optional[str] = None,
    role_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """List all invites for the clinic"""
    query = db.query(Invite).filter(Invite.clinic_id == current_user.clinic_id)
    
    if status_filter:
        query = query.filter(Invite.status == status_filter)
    if role_filter:
        query = query.filter(Invite.role == role_filter)
    
    total = query.count()
    pending_count = db.query(Invite).filter(
        Invite.clinic_id == current_user.clinic_id,
        Invite.status == "pending"
    ).count()
    accepted_count = db.query(Invite).filter(
        Invite.clinic_id == current_user.clinic_id,
        Invite.status == "accepted"
    ).count()
    
    invites = query.order_by(Invite.created_at.desc()).offset(skip).limit(limit).all()
    
    return InviteListResponse(
        items=[InviteResponse.model_validate(inv) for inv in invites],
        total=total,
        pending_count=pending_count,
        accepted_count=accepted_count
    )


@router.post("", response_model=InviteResponse)
async def create_invite(
    invite_data: InviteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """
    Create a new invite.
    - Owners can invite admins and doctors
    - Admins can only invite doctors
    """
    # Check role permissions
    if current_user.role == "admin" and invite_data.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot invite other admins. Only owners can invite admins."
        )
    
    if current_user.role == "admin" and invite_data.role == "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot invite owners."
        )
    
    # Validate role
    if invite_data.role not in ["admin", "doctor"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'admin' or 'doctor'."
        )
    
    # Check if email already exists as a user
    existing_user = db.query(User).filter(
        User.email == invite_data.email,
        User.clinic_id == current_user.clinic_id
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in your clinic."
        )
    
    # Check for existing pending invite
    existing_invite = db.query(Invite).filter(
        Invite.email == invite_data.email,
        Invite.clinic_id == current_user.clinic_id,
        Invite.status == "pending"
    ).first()
    if existing_invite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An invite for this email is already pending."
        )
    
    # Check doctor limit
    if invite_data.role == "doctor":
        limits = await get_invite_limits(db, current_user)
        if not limits.can_invite:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Doctor limit reached. Maximum {MAX_DOCTORS_PER_CLINIC} doctors allowed per clinic."
            )
    
    # Create invite
    invite = Invite(
        email=invite_data.email,
        role=invite_data.role,
        clinic_id=current_user.clinic_id,
        invited_by=current_user.id,
        token=generate_invite_token(),
        expires_at=datetime.utcnow() + timedelta(days=INVITE_EXPIRY_DAYS)
    )
    
    db.add(invite)
    db.commit()
    db.refresh(invite)
    
    # Send invite email (async, don't block on failure)
    try:
        await send_invite_email(
            to_email=invite_data.email,
            inviter_name=current_user.name,
            clinic_name=current_user.clinic.name if current_user.clinic else "Your Clinic",
            role=invite_data.role,
            invite_token=invite.token
        )
    except Exception as e:
        print(f"Failed to send invite email: {e}")
    
    return InviteResponse.model_validate(invite)


@router.post("/bulk", response_model=BulkInviteResponse)
async def create_bulk_invites(
    bulk_data: BulkInviteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """Create multiple invites at once"""
    # Check role permissions
    if current_user.role == "admin" and bulk_data.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins can only invite doctors."
        )
    
    if bulk_data.role not in ["admin", "doctor"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'admin' or 'doctor'."
        )
    
    # Check doctor limit for bulk invites
    if bulk_data.role == "doctor":
        limits = await get_invite_limits(db, current_user)
        if len(bulk_data.emails) > limits.remaining_slots:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot invite {len(bulk_data.emails)} doctors. Only {limits.remaining_slots} slots remaining."
            )
    
    successful = []
    failed = []
    
    for email in bulk_data.emails:
        try:
            # Check if email already exists
            existing_user = db.query(User).filter(
                User.email == email,
                User.clinic_id == current_user.clinic_id
            ).first()
            if existing_user:
                failed.append({"email": email, "reason": "User already exists"})
                continue
            
            # Check for existing pending invite
            existing_invite = db.query(Invite).filter(
                Invite.email == email,
                Invite.clinic_id == current_user.clinic_id,
                Invite.status == "pending"
            ).first()
            if existing_invite:
                failed.append({"email": email, "reason": "Invite already pending"})
                continue
            
            # Create invite
            invite = Invite(
                email=email,
                role=bulk_data.role,
                clinic_id=current_user.clinic_id,
                invited_by=current_user.id,
                token=generate_invite_token(),
                expires_at=datetime.utcnow() + timedelta(days=INVITE_EXPIRY_DAYS)
            )
            db.add(invite)
            successful.append(email)
            
            # Send invite email
            try:
                await send_invite_email(
                    to_email=email,
                    inviter_name=current_user.name,
                    clinic_name=current_user.clinic.name if current_user.clinic else "Your Clinic",
                    role=bulk_data.role,
                    invite_token=invite.token
                )
            except Exception as e:
                print(f"Failed to send invite email to {email}: {e}")
                
        except Exception as e:
            failed.append({"email": email, "reason": str(e)})
    
    db.commit()
    
    return BulkInviteResponse(
        successful=successful,
        failed=failed,
        total_sent=len(successful)
    )


@router.delete("/{invite_id}")
async def cancel_invite(
    invite_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """Cancel a pending invite"""
    invite = db.query(Invite).filter(
        Invite.id == invite_id,
        Invite.clinic_id == current_user.clinic_id
    ).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found"
        )
    
    if invite.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only cancel pending invites"
        )
    
    invite.status = "cancelled"
    db.commit()
    
    return {"message": "Invite cancelled successfully"}


@router.post("/{invite_id}/resend")
async def resend_invite(
    invite_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner_or_admin)
):
    """Resend an invite email and extend expiry"""
    invite = db.query(Invite).filter(
        Invite.id == invite_id,
        Invite.clinic_id == current_user.clinic_id
    ).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found"
        )
    
    if invite.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only resend pending invites"
        )
    
    # Generate new token and extend expiry
    invite.token = generate_invite_token()
    invite.expires_at = datetime.utcnow() + timedelta(days=INVITE_EXPIRY_DAYS)
    db.commit()
    
    # Send invite email
    try:
        await send_invite_email(
            to_email=invite.email,
            inviter_name=current_user.name,
            clinic_name=current_user.clinic.name if current_user.clinic else "Your Clinic",
            role=invite.role,
            invite_token=invite.token
        )
    except Exception as e:
        print(f"Failed to resend invite email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send invite email"
        )
    
    return {"message": "Invite resent successfully"}


# Public endpoint - no auth required
@router.get("/verify/{token}")
async def verify_invite(
    token: str,
    db: Session = Depends(get_db)
):
    """Verify an invite token and return invite details"""
    invite = db.query(Invite).filter(Invite.token == token).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite link"
        )
    
    if invite.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This invite has already been {invite.status}"
        )
    
    if invite.expires_at < datetime.utcnow():
        invite.status = "expired"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite has expired"
        )
    
    return {
        "email": invite.email,
        "role": invite.role,
        "clinic_name": invite.clinic.name if invite.clinic else "Unknown Clinic",
        "inviter_name": invite.inviter.name if invite.inviter else "Unknown"
    }


# Public endpoint - no auth required
@router.post("/accept/{token}")
async def accept_invite(
    token: str,
    accept_data: InviteAccept,
    db: Session = Depends(get_db)
):
    """Accept an invite and create user account"""
    invite = db.query(Invite).filter(Invite.token == token).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite link"
        )
    
    if invite.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This invite has already been {invite.status}"
        )
    
    if invite.expires_at < datetime.utcnow():
        invite.status = "expired"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite has expired"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == invite.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Create user
    password_hash = pwd_context.hash(accept_data.password)
    
    # If doctor, create doctor record first
    doctor_id = None
    if invite.role == "doctor":
        doctor = Doctor(
            clinic_id=invite.clinic_id,
            name=accept_data.name,
            email=invite.email,
            status="active"
        )
        db.add(doctor)
        db.flush()
        doctor_id = doctor.id
    
    user = User(
        email=invite.email,
        password_hash=password_hash,
        name=accept_data.name,
        role=invite.role,
        clinic_id=invite.clinic_id,
        doctor_id=doctor_id,
        status="active"
    )
    
    db.add(user)
    
    # Update invite status
    invite.status = "accepted"
    invite.accepted_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": "Account created successfully",
        "email": user.email,
        "role": user.role
    }
