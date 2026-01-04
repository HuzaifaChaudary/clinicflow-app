"""
Authentication API Routes

Google OAuth authentication endpoints for the ClinicFlow application.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas import (
    GoogleAuthRequest,
    GoogleAuthCallback,
    SignupRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse,
)
from app.services.auth_service import AuthService
from app.api.deps import get_current_user, validate_refresh_token
from app.models import User
from app.core.exceptions import AuthenticationError, AuthorizationError


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/google/url")
async def get_google_auth_url(
    redirect_uri: str,
    state: str = None,
) -> dict:
    """
    Get the Google OAuth authorization URL.
    
    The frontend redirects the user to this URL to initiate the OAuth flow.
    After authorization, Google redirects back to the specified redirect_uri
    with an authorization code.
    
    Args:
        redirect_uri: The URI to redirect to after Google auth
        state: Optional state parameter for CSRF protection
    
    Returns:
        The Google OAuth authorization URL
    """
    auth_service = AuthService()
    auth_url = auth_service.get_google_auth_url(redirect_uri, state)
    return {"auth_url": auth_url}


@router.post("/google/callback", response_model=TokenResponse)
async def google_auth_callback(
    callback: GoogleAuthCallback,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Handle Google OAuth callback.
    
    Exchanges the authorization code for tokens, retrieves user info from Google,
    and either logs in an existing user or creates a new user account.
    
    Args:
        callback: The authorization code and redirect URI from Google
        db: Database session
    
    Returns:
        Access and refresh tokens
    
    Raises:
        HTTPException: If authentication fails
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.authenticate_with_google(
            code=callback.code,
            redirect_uri=callback.redirect_uri,
        )
        return TokenResponse(**result)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}",
        )


@router.post("/signup", response_model=TokenResponse)
async def signup_with_google(
    signup_data: SignupRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Sign up a new user with Google OAuth.
    
    This endpoint is used when a user submits the signup form on the web.
    It initiates Google OAuth and creates a new user account with the provided
    clinic information.
    
    The flow:
    1. User fills out signup form with clinic name, their name, email
    2. Frontend redirects to Google OAuth
    3. Google redirects back with authorization code
    4. This endpoint is called with the code and signup data
    5. New clinic and user are created
    
    Args:
        signup_data: User and clinic information from the signup form
        db: Database session
    
    Returns:
        Access and refresh tokens
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.signup_with_google(
            code=signup_data.google_code,
            redirect_uri=signup_data.redirect_uri,
            clinic_name=signup_data.clinic_name,
            first_name=signup_data.first_name,
            last_name=signup_data.last_name,
        )
        return TokenResponse(**result)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except AuthorizationError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Refresh the access token using a refresh token.
    
    Args:
        request: The refresh token
        db: Database session
    
    Returns:
        New access and refresh tokens
    """
    auth_service = AuthService(db)
    
    try:
        result = await auth_service.refresh_access_token(request.refresh_token)
        return TokenResponse(**result)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post("/logout")
async def logout(
    request: RefreshTokenRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Log out the current user.
    
    Invalidates the refresh token and associated session.
    
    Args:
        request: The refresh token to invalidate
        current_user: The authenticated user
        db: Database session
    
    Returns:
        Success message
    """
    auth_service = AuthService(db)
    
    try:
        await auth_service.logout(request.refresh_token)
        return {"message": "Successfully logged out"}
    except Exception as e:
        # Even if logout fails, return success to client
        return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Get the current authenticated user's information.
    
    Args:
        current_user: The authenticated user
    
    Returns:
        User information
    """
    return UserResponse.model_validate(current_user)


@router.get("/verify")
async def verify_token(
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Verify that the current access token is valid.
    
    Args:
        current_user: The authenticated user
    
    Returns:
        Token validity status and user info
    """
    return {
        "valid": True,
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role.value,
    }
