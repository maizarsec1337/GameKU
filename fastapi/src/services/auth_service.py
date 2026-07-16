"""
Auth Service
Service layer untuk business logic autentikasi
"""

from datetime import datetime

# TODO:
# Import dari database mongodb
# from src.database.mongodb import user_repo, get_database

# TODO:
# Import firebase_admin untuk verifikasi
# from firebase_admin import auth as firebase_auth


async def register_user(email: str, password: str, full_name: str, username: str = None, phone: str = None, role: str = "user"):
    """
    Register pengguna baru
    
    TODO:
    # Implementasi Firebase Authentication.
    # Sinkronisasi User ke Database.
    # Membuat Session menggunakan HttpOnly Cookie.
    """
    # TODO: Implementasi Firebase create user
    # user_record = firebase_auth.create_user(
    #     email=email,
    #     password=password,
    # )
    
    # TODO: Simpan ke MongoDB
    # user_data = {
    #     "uid_firebase": user_record.uid,
    #     "nama": full_name,
    #     "email": email,
    #     "username": username,
    #     "nomor_telepon": phone,
    #     "provider": "email",
    #     "role": role,
    #     "status": "active",
    #     "email_verified": False,
    #     "created_at": datetime.utcnow(),
    #     "updated_at": datetime.utcnow()
    # }
    # return await user_repo.create(user_data)
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def login_user(email: str, password: str):
    """
    Login pengguna
    
    TODO:
    # Implementasi Firebase Authentication.
    # Verifikasi Firebase ID Token.
    # Membuat Session menggunakan HttpOnly Cookie.
    """
    # TODO: Verifikasi dengan Firebase Auth REST API atau custom token
    # user = await user_repo.get_by_email(email)
    # 
    # TODO: Generate custom token Firebase
    # custom_token = firebase_auth.create_custom_token(user['uid_firebase'])
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def google_login():
    """
    Google OAuth login
    
    TODO:
    # Google Login.
    # Redirect ke halaman Google OAuth.
    """
    # TODO: Redirect ke Google OAuth
    # return RedirectResponse(url=google_oauth_url)
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def google_callback(id_token: str):
    """
    Handle Google OAuth callback
    
    TODO:
    # Google Login.
    # Verifikasi Firebase ID Token dari Google.
    # Membuat Session menggunakan HttpOnly Cookie.
    """
    # TODO: Verifikasi token Google
    # decoded_token = firebase_auth.verify_id_token(id_token)
    # 
    # TODO: Cek apakah user sudah ada
    # user = await user_repo.get_by_provider('google', decoded_token['sub'])
    # if not user:
    #     # Buat user baru
    #     user = await register_user(
    #         email=decoded_token['email'],
    #         password=None,  # SSO tidak butuh password
    #         full_name=decoded_token.get('name', ''),
    #         provider='google'
    #     )
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def logout_user(user_id: str):
    """
    Logout pengguna
    
    TODO:
    # Logout.
    # Invalidate session di database.
    """
    # TODO: Hapus session dari database
    # await get_database().sessions.delete_one({"user_id": user_id})
    
    return {"success": True, "message": "Logout berhasil"}


async def get_current_user(user_id: str):
    """
    Mendapatkan data user yang sedang login
    
    TODO:
    # Verifikasi Firebase ID Token.
    # Ambil data user dari database.
    """
    # TODO: Ambil user dari database
    # user = await user_repo.get_by_id(user_id)
    # return user
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def forgot_password(email: str):
    """
    Kirim email reset password
    
    TODO:
    # Reset Password.
    # Kirim email reset password via Firebase.
    """
    # TODO: Kirim email reset via Firebase
    # firebase_auth.generate_password_reset_link(email)
    
    return {"success": True, "message": "Email reset password telah dikirim"}


async def reset_password(token: str, new_password: str):
    """
    Reset password dengan token
    
    TODO:
    # Reset Password.
    # Verifikasi token dan update password di Firebase.
    """
    # TODO: Verifikasi dan reset password
    # firebase_auth.verify_password_reset_code(token)
    # firebase_auth.confirm_password_reset(token, new_password)
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def refresh_session(refresh_token: str):
    """
    Refresh session/token
    
    TODO:
    # Refresh Session.
    # Generate token baru dari Firebase.
    """
    # TODO: Refresh token Firebase
    # return firebase_auth.refresh_token(refresh_token)
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def register_reseller(user_id: str, ktp_data: dict):
    """
    Register user sebagai reseller
    
    TODO:
    # Sinkronisasi User ke Database.
    # Update role user menjadi reseller.
    """
    # TODO: Buat entry reseller di MongoDB
    # reseller_data = {
    #     "user_id": user_id,
    #     "nama_lengkap": ktp_data.get('full_name'),
    #     "nomor_ktp": ktp_data.get('ktp_number'),
    #     "alamat": ktp_data.get('address'),
    #     "foto_ktp": ktp_data.get('ktp_photo'),
    #     "selfie_dengan_ktp": ktp_data.get('selfie'),
    #     "bank_account": ktp_data.get('bank_account'),
    #     "account_holder_name": ktp_data.get('account_holder'),
    #     "status_verifikasi": "proses",
    #     "tanggal_pengajuan": datetime.utcnow()
    # }
    # await get_database().resellers.insert_one(reseller_data)
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan"}


async def get_reseller_status(user_id: str):
    """
    Mendapatkan status reseller
    
    TODO:
    # Ambil status reseller dari database.
    """
    # TODO: Ambil status reseller
    # reseller = await get_database().resellers.find_one({"user_id": user_id})
    # if not reseller:
    #     return {"status": "belum"}
    # return {"status": reseller.get("status_verifikasi", "belum")}
    
    return {"success": False, "message": "Firebase Auth belum diimplementasikan", "status": "belum"}