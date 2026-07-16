"""
Role-based Middleware
Middleware untuk proteksi route berdasarkan role user
"""

from typing import List
from fastapi import Depends, HTTPException

# TODO:
# Import dari auth middleware
# from src.middleware.auth_middleware import get_current_user


def require_role(roles: List[str]):
    """
    Factory function untuk middleware role-based access
    
    TODO:
    # Middleware Role.
    """
    async def role_checker(user = Depends(get_current_user)):
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
        
        # TODO: Implementasi pengecekan role
        # if user.get('role') not in roles:
        #     raise HTTPException(status_code=403, detail="Forbidden - Anda tidak memiliki akses ke resource ini")
        
        return user
    return role_checker


# Role checkers
def require_admin(user = Depends(get_current_user)):
    """
    Middleware untuk role admin
    
    TODO:
    # Middleware Admin.
    # Cek apakah user memiliki role admin atau super_admin.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
    
    # TODO: Implementasi pengecekan role admin
    # if user.get('role') not in ['admin', 'super_admin']:
    #     raise HTTPException(status_code=403, detail="Forbidden - Hanya admin yang diizinkan")
    
    return user


def require_seller(user = Depends(get_current_user)):
    """
    Middleware untuk role seller/reseller
    
    TODO:
    # Middleware Seller.
    # Cek apakah user memiliki role seller atau reseller.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
    
    # TODO: Implementasi pengecekan role seller
    # if user.get('role') not in ['seller', 'reseller']:
    #     raise HTTPException(status_code=403, detail="Forbidden - Hanya seller yang diizinkan")
    
    return user


def require_user(user = Depends(get_current_user)):
    """
    Middleware untuk role user biasa
    
    TODO:
    # Middleware User.
    # Cek apakah user memiliki role user.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
    
    # TODO: Implementasi pengecekan role user
    # if user.get('role') != 'user':
    #     raise HTTPException(status_code=403, detail="Forbidden - Hanya user biasa yang diizinkan")
    
    return user


def require_staff(user = Depends(get_current_user)):
    """
    Middleware untuk role staff
    
    TODO:
    # Middleware Staff.
    # Cek apakah user memiliki role staff.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
    
    # TODO: Implementasi pengecekan role staff
    # if user.get('role') not in ['staff', 'admin', 'super_admin']:
    #     raise HTTPException(status_code=403, detail="Forbidden - Hanya staff yang diizinkan")
    
    return user


def require_super_admin(user = Depends(get_current_user)):
    """
    Middleware untuk role super admin
    
    TODO:
    # Middleware Super Admin.
    # Cek apakah user memiliki role super_admin.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized - Silakan login terlebih dahulu")
    
    # TODO: Implementasi pengecekan role super admin
    # if user.get('role') != 'super_admin':
    #     raise HTTPException(status_code=403, detail="Forbidden - Hanya super admin yang diizinkan")
    
    return user