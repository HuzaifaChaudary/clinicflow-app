"""Google OAuth service for authentication"""
import httpx
from typing import Optional, Dict
from app.config import settings


async def verify_google_token(id_token: str) -> Optional[Dict]:
    """
    Verify Google ID token and return user info
    
    Args:
        id_token: Google ID token from frontend
        
    Returns:
        Dict with user info (email, name, google_id) or None if invalid
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise ValueError("Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env")
    
    try:
        # Verify token with Google
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}"
            )
            
            if response.status_code != 200:
                return None
            
            token_data = response.json()
            
            # Verify audience matches our client ID
            if token_data.get("aud") != settings.GOOGLE_CLIENT_ID:
                return None
            
            # Return user info
            return {
                "email": token_data.get("email"),
                "name": token_data.get("name", token_data.get("given_name", "") + " " + token_data.get("family_name", "")).strip(),
                "google_id": token_data.get("sub"),
                "email_verified": token_data.get("email_verified", False)
            }
    except Exception as e:
        print(f"Error verifying Google token: {e}")
        return None


async def get_google_user_info(access_token: str) -> Optional[Dict]:
    """
    Get user info from Google using access token
    
    Args:
        access_token: Google OAuth access token
        
    Returns:
        Dict with user info (email, name, google_id) or None if invalid
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code != 200:
                return None
            
            user_data = response.json()
            
            return {
                "email": user_data.get("email"),
                "name": user_data.get("name", ""),
                "google_id": user_data.get("id"),
                "email_verified": user_data.get("verified_email", False)
            }
    except Exception as e:
        print(f"Error getting Google user info: {e}")
        return None

