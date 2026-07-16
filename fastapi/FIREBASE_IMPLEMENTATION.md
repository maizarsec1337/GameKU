# Panduan Implementasi Firebase Authentication - FastAPI Backend

## Backend yang Dipakai
**FastAPI (Python)** - `fastapi/`

## Database yang Dipakai
**MongoDB** - `fastapi/src/database/mongodb.py`

## Struktur File yang Perlu Diimplementasikan

### 1. fastapi/src/config/firebase.py
**Status:** Placeholder - perlu diisi developer backend
**Keterangan:** Konfigurasi Firebase Admin SDK
**Yang perlu dikerjakan:**
- Import firebase_admin
- Inisialisasi Firebase Admin dengan credential dari environment variable
- Implementasi verify_id_token
- Implementasi create_custom_token
- Implementasi generate_password_reset_link

### 2. fastapi/src/middleware/auth_middleware.py
**Status:** Placeholder - perlu diisi developer backend
**Keterangan:** Middleware untuk verifikasi token
**Yang perlu dikerjakan:**
- get_current_user: Verifikasi Firebase ID Token
- get_current_active_user: Cek status user active
- optional_auth: Route yang tidak wajib login

### 3. fastapi/src/middleware/role_middleware.py
**Status:** Placeholder - perlu diisi developer backend
**Keterangan:** Middleware untuk role-based access
**Role yang didukung:**
- user (default setelah register)
- seller/reseller (setelah verifikasi)
- admin
- staff
- super_admin

### 4. fastapi/src/services/auth_service.py
**Status:** Placeholder - perlu diisi developer backend
**Keterangan:** Service layer untuk business logic auth
**Fungsi yang perlu diimplementasikan:**
- register_user: Register + Firebase create user
- login_user: Login + Firebase verify
- google_login: Redirect ke Google OAuth
- google_callback: Handle callback + create user if new
- logout_user: Hapus session
- get_current_user: Ambil data user dari DB
- forgot_password: Firebase reset link
- reset_password: Firebase password reset
- refresh_session: Refresh token Firebase
- register_reseller: Buat entry reseller
- get_reseller_status: Cek status reseller

### 5. fastapi/src/controllers/auth_controller.py
**Status:** Mock data - perlu diganti dengan implementasi nyata
**Keterangan:** Controller untuk endpoint auth
**Endpoint yang perlu diupdate:**
- register: POST /api/auth/register
- login: POST /api/auth/login
- google_auth: POST /api/auth/google
- logout: POST /api/auth/logout
- get_user: GET /api/auth/user (perlu middleware auth)

### 6. fastapi/src/routes/auth.py
**Status:** Sudah ada - perlu diupdate
**Keterangan:** Route definition
**Perlu ditambahkan:**
- middleware dependencies untuk route yang dilindungi
- endpoint /me (GET) untuk dapat user yang login
- endpoint /forgot-password (POST)
- endpoint /reset-password (POST)
- endpoint /reseller (POST)
- endpoint /reseller/status (GET)

### 7. fastapi/src/database/mongodb.py
**Status:** Sudah ada + perlu update
**Keterangan:** Repository untuk database
**Telah ditambahkan:**
- UserRepository.get_by_uid_firebase()
- ResellerRepository (baru)

## Skema Database User

```javascript
// Collection: users
{
  _id: ObjectId,           // MongoDB ID
  uid_firebase: string,    // Firebase UID (TODO: diisi saat implementasi)
  nama: string,            // Nama lengkap
  email: string,           // Email (unique)
  nomor_telepon: string,   // Nomor telepon
  foto: string,            // URL foto profil
  provider: string,        // email, google, dll
  role: string,            // user, seller, admin, staff
  status: string,          // active, inactive, suspended
  email_verified: boolean,
  created_at: datetime,
  updated_at: datetime,
  last_login: datetime
}
```

## Skema Database Reseller

```javascript
// Collection: resellers
{
  _id: ObjectId,
  user_id: ObjectId,       // Reference ke users._id
  nama_lengkap: string,    // Nama sesuai KTP
  nomor_ktp: string,       // Nomor KTP
  alamat: string,          // Alamat lengkap
  foto_ktp: string,        // URL foto KTP
  selfie_dengan_ktp: string, // URL selfie dengan KTP
  bank_account: string,    // Nomor rekening
  account_holder_name: string, // Nama pemilik rekening
  status_verifikasi: string, // belum, proses, disetujui, ditolak
  tanggal_pengajuan: datetime,
  tanggal_persetujuan: datetime,
  admin_approval: ObjectId, // Ref ke admin yang approve
  catatan: string          // Catatan verifikasi
}
```

## Environment Variables yang Diperlukan

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_DATABASE_URL` (opsional)

## Endpoint API Frontend ke Backend

| Method | Endpoint | Keterangan | Middleware |
|--------|----------|------------|------------|
| POST | /api/auth/register | Register user | - |
| POST | /api/auth/login | Login user | - |
| GET | /api/auth/google | Google OAuth redirect | - |
| POST | /api/auth/google | Google callback/token | - |
| POST | /api/auth/logout | Logout user | - |
| GET | /api/auth/me | Get current user | authMiddleware |
| POST | /api/auth/forgot-password | Send reset email | - |
| POST | /api/auth/reset-password | Reset password | - |
| POST | /api/auth/reseller | Register reseller | authMiddleware |
| GET | /api/auth/reseller/status | Get reseller status | authMiddleware |

## File Frontend yang Tidak Perlu Diubah

Semua file di `frontend/src/` sudah siap:
- `services/authAPI.js` - Tidak perlu diubah
- `context/AuthContext.jsx` - Tidak perlu diubah
- `components/RouteProtection.jsx` - Tidak perlu diubah
- `main.jsx` - Tidak perlu diubah
- `pages/Login.jsx` - Tidak perlu diubah
- `pages/Register.jsx` - Tidak perlu diubah
- `pages/Profile.jsx` - Tidak perlu diubah
- `pages/ForgotPassword.jsx` - Tidak perlu diubah
- `pages/ResetPassword.jsx` - Tidak perlu diubah