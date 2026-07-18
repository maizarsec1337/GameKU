# Security Service Integration Guide

## Gambaran Arsitektur

```
Frontend (React + Vite)
    ↓
Backend (Node.js Express / FastAPI)
    ↓
Security Service (Haskell)
    ↓
Backend
    ↓
Database (MongoDB)
    ↓
Frontend
```

## Backend yang Digunakan

Project ini memiliki DUA backend:
1. **Node.js Express** - di folder `backend/` (port 8000)
2. **FastAPI Python** - di folder `fastapi/` (port 8000)

Security Service akan diintegrasikan ke keduanya melalui HTTP API.

## Database yang Digunakan

**MongoDB** - diakses melalui connection string:
- MONGODB_URI: `mongodb://localhost:27017`
- MONGODB_DB: `gameku`

## Lokasi Koneksi Database

- FastAPI: `fastapi/src/database/mongodb.py`
- Node.js Express: Belum ada modul database (menggunakan placeholder)

## Struktur Security Service

```
security-service/
├── README.md                    # Dokumentasi Security Service
├── package.yaml                 # Konfigurasi package Haskell
└── src/
    ├── api/
    │   └── endpoints.dhall        # Definisi endpoint untuk developer Haskell
    ├── config/
    │   └── config.yaml           # Konfigurasi environment Security Service
    └── models/
        └── security_models.dhall   # Tipe data untuk Security Service
```

## File Backend untuk Komunikasi Security Service

### Node.js Express (`backend/`)
```
backend/src/security/
├── client.js       # HTTP client untuk Security Service
├── middleware.js   # Middleware keamanan
└── gateway.js      # Interface database untuk Security Service
```

### FastAPI (`fastapi/`)
```
fastapi/src/security/
├── __init__.py     # Module exports
├── client.py       # HTTP client untuk Security Service
├── middleware.py   # Middleware keamanan
└── gateway.py      # Interface database untuk Security Service
```

## File yang Perlu Dikerjakan Developer Haskell

1. **security-service/package.yaml** - Konfigurasi dependencies Haskell
2. **security-service/src/api/endpoints.dhall** - Implementasi semua endpoint:
   - POST /validate/request
   - POST /validate/signature
   - POST /validate/timestamp
   - POST /validate/nonce
   - POST /signature/generate
   - POST /signature/verify
   - POST /hash
   - POST /encrypt
   - POST /decrypt
   - POST /token/verify
   - POST /token/validate
   - POST /fraud/check
   - POST /fraud/score
   - POST /audit/log
   - GET /audit/history
   - POST /integrity/check
   - POST /validate/steam-key
   - POST /validate/giftcard
   - POST /validate/voucher
   - POST /webhook/verify
   - POST /rate-limit/check
   - POST /ip/reputation
   - POST /device/fingerprint

## Environment Variables

Buat file `.env.security` dari template `.env.security.example`:

```bash
# Security Service Configuration
SECURITY_SERVICE_HOST=localhost
SECURITY_SERVICE_PORT=8080
SECURITY_API_KEY=your-api-key-here

# Security Secrets
SECURITY_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=gameku
```

## Cara Mengintegrasikan Security Service di Backend

### Node.js Express

```javascript
// Import security client
const { validateRequest, verifyToken, checkFraud } = require('./src/security/client');

// Di controller
const register = async (req, res) => {
  // TODO: Validasi Request via Security Service
  // const requestValidation = await validateRequest(req);
  // if (!requestValidation.valid) {
  //   return res.status(401).json({ message: 'Invalid request' });
  // }
  
  // TODO: Nonce Validation
  // const nonceResult = await validateNonce(req.headers['x-nonce'], req.headers['x-timestamp']);
  
  // TODO: Timestamp Validation
  // const tsResult = await validateTimestamp(req.headers['x-timestamp']);
  
  // TODO: Signature Validation
  // const sigResult = await validateSignature(req.headers['x-signature'], req.body, process.env.SECURITY_SECRET);
  
  // ... proses registrasi
};
```

### FastAPI

```python
# Import security client
from src.security.client import validate_request, verify_token, check_fraud

# Di controller
@router.post("/register")
async def register_route(data: AuthRegister):
    # TODO: Validasi Request via Security Service
    # result = await validate_request(data.dict())
    
    # ... proses registrasi
```

## Flow Request dengan Security Service

1. Frontend mengirim request dengan header keamanan:
   - X-Timestamp: Unix timestamp
   - X-Nonce: Random string unik
   - X-Signature: Signature HMAC-SHA256(request_body)

2. Backend mengecek header keamanan:
   - Validasi nonce (cek replay attack)
   - Validasi timestamp (cek masa berlaku)
   - Validasi signature (cek integritas)

3. Backend memanggil Security Service untuk proses bisnis

4. Security Service mengakses database MongoDB bila diperlukan

5. Security Service mengembalikan hasil ke Backend

6. Backend mengembalikan response ke Frontend

## TODO Priority untuk Developer Haskell

1. **High Priority:**
   - Endpoint validasi nonce (replay attack protection)
   - Endpoint validasi timestamp
   - Endpoint validasi signature
   - Endpoint verify token

2. **Medium Priority:**
   - Endpoint fraud check & risk scoring
   - Endpoint audit log
   - Endpoint rate limit check
   - Endpoint integrity check

3. **Low Priority:**
   - Endpoint hash
   - Endpoint encrypt/decrypt
   - Endpoint webhook verify
   - Endpoint IP reputation
   - Endpoint device fingerprint (placeholder)