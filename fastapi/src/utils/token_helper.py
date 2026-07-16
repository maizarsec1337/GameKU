"""
Token Helper Utility
Utility untuk manipulasi dan manajemen token
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# TODO:
# Import JWT library
# import jwt

# TODO:
# Import dari firebase config
# from src.config.firebase import verify_id_token


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifikasi token Firebase
    
    TODO:
    # Verifikasi Firebase ID Token.
    # Decode token untuk mendapatkan user info.
    """
    # TODO: Implementasi verifikasi token
    # return verify_id_token(token)
    return None


def generate_jwt_token(user_id: str, role: str, expires_in: int = 3600) -> Optional[str]:
    """
    Generate JWT token untuk session
    
    TODO:
    # Generate JWT Token.
    # Payload berisi user_id dan role.
    """
    # TODO: Implementasi JWT token
    # payload = {
    #     'user_id': user_id,
    #     'role': role,
    #     'exp': datetime.utcnow() + timedelta(seconds=expires_in)
    # }
    # return jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
    return None


def generate_refresh_token(user_id: str, expires_in: int = 604800) -> Optional[str]:
    """
    Generate refresh token
    
    TODO:
    # Generate refresh token.
    """
    # TODO: Implementasi refresh token
    # return generate_jwt_token(user_id, 'refresh', expires_in)
    return None


def set_token_cookie(response, token: str, refresh_token: str = None):
    """
    Set cookie untuk session
    
    TODO:
    # Membuat Session menggunakan HttpOnly Cookie.
    # Set cookie dengan httpOnly, secure, dan SameSite.
    """
    # TODO: Implementasi set cookie
    # response.set_cookie(
    #     key='token',
    #     value=token,
    #     httponly=True,
    #     secure=os.getenv('NODE_ENV') == 'production',
    #     samesite='strict',
    #     max_age=3600
    # )
    pass


def clear_token_cookie(response):
    """
    Clear cookie untuk logout
    
    TODO:
    # Logout.
    # Clear cookie session.
    """
    # TODO: Implementasi clear cookie
    # response.delete_cookie('token')
    pass


def extract_token(authorization: Optional[str]) -> Optional[str]:
    """
    Extract token dari header authorization
    
    TODO:
    # Ambil token dari header Authorization.
    """
    if not authorization or not authorization.startswith('Bearer '):
        return None
    return authorization[7:]


def is_valid_token_format(token: str) -> bool:
    """
    Validate token format
    
    TODO:
    # Validate token format.
    """
    if not token or not isinstance(token, str):
        return False
    
    parts = token.split('.')
    return len(parts) == 3


def is_token_expired(token: str) -> bool:
    """
    Check apakah token expired
    
    TODO:
    # Check token expired.
    """
    # TODO: Implementasi check expired
    return True


def decode_token_payload(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode token tanpa verifikasi
    
    TODO:
    # Decode token untuk mendapatkan payload.
    """
    # TODO: Implementasi decode
    # return jwt.decode(token, options={"verify_signature": False})
    return None