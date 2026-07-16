users = [
    {"id": 1, "email": "admin@gameku.com", "password": "hashed_password", "name": "Admin Gameku", "role": "admin"},
    {"id": 2, "email": "user@gameku.com", "password": "hashed_password", "name": "User Gameku", "role": "user"}
]

# TODO:
# Import Security Service client untuk validasi token
# from src.security.client import verify_token, log_audit, check_fraud

# TODO:
# Import Security Service gateway untuk database operasi
# from src.security.gateway import check_and_insert_nonce, insert_audit_log


def register(email: str, password: str, name: str):
    # TODO: Implementasi Security Service - Validasi Request.
    # TODO: Implementasi Security Service - Nonce Validation.
    # TODO: Implementasi Security Service - Timestamp Validation.
    # TODO: Implementasi Security Service - Request Signature.
    try:
        existing = next((u for u in users if u["email"] == email), None)
        if existing:
            return {"success": False, "message": "Email sudah terdaftar"}, 400
        new_user = {
            "id": len(users) + 1,
            "email": email,
            "password": password,  # TODO: hash
            "name": name,
            "role": "user"
        }
        users.append(new_user)
        return {"success": True, "message": "Registrasi berhasil", "data": {"id": new_user["id"], "email": new_user["email"], "name": new_user["name"]}}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


def login(email: str, password: str):
    # TODO: Implementasi Security Service - Validasi Request.
    # TODO: Implementasi Security Service - Nonce Validation.
    # TODO: Implementasi Security Service - Timestamp Validation.
    # TODO: Implementasi Security Service - Request Signature.
    # TODO: Implementasi Security Service - Token Verification.
    try:
        user = next((u for u in users if u["email"] == email), None)
        if not user or user["password"] != password:  # TODO: verify hash
            return {"success": False, "message": "Email atau password salah"}, 401
        return {"success": True, "message": "Login berhasil", "data": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


def google_auth(id_token: str):
    # TODO: Verify Firebase/Google ID token
    try:
        # Mock response
        return {"success": True, "message": "Google login berhasil", "data": {"id": 999, "email": "google@user.com", "name": "Google User", "role": "user"}}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


def logout():
    return {"success": True, "message": "Logout berhasil"}


def get_user():
    # Mock - in real app, get from JWT token
    return {"success": True, "data": {"id": 1, "email": "user@gameku.com", "name": "User Gameku", "role": "user"}}
