"""
Firebase Configuration
Konfigurasi Firebase Admin SDK untuk FastAPI

PERHATIAN:
- JANGAN mengisi credential di file ini
- Gunakan environment variable untuk menyimpan credential
- Developer backend yang akan mengisi konfigurasi
"""

# TODO:
# Import firebase_admin
# import firebase_admin
# from firebase_admin import credentials, auth

# TODO:
# Inisialisasi Firebase Admin
# firebase_admin.initialize_app(
#     credentials.ApplicationDefault(),
#     options={
#         'projectId': os.getenv('FIREBASE_PROJECT_ID'),
#     }
# )

# TODO:
# Export auth instance
# auth = firebase_admin.auth

# Placeholder - akan diisi oleh developer backend
auth = None
db = None


def get_firebase_auth():
    """
    Mendapatkan Firebase Auth instance
    
    TODO:
    # Return firebase_admin.auth
    """
    return auth


def verify_id_token(id_token: str):
    """
    Verifikasi Firebase ID Token
    
    TODO:
    # Implementasi verifikasi token
    # return auth.verify_id_token(id_token)
    """
    return None


def create_custom_token(uid: str, role: str = None):
    """
    Buat custom token untuk user
    
    TODO:
    # Implementasi pembuatan custom token
    # return auth.create_custom_token(uid, {'role': role})
    """
    return None


def generate_password_reset_link(email: str):
    """
    Generate link reset password
    
    TODO:
    # Implementasi generate reset link
    # return auth.generate_password_reset_link(email)
    """
    return None