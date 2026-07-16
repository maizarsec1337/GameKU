-- Security Models untuk Haskell
-- File ini berisi definisi tipe data untuk Security Service

-- TODO:
-- Implementasi tipe data di Haskell menggunakan Aeson

-- User type untuk komunikasi dengan database MongoDB
-- type User = {
--   id: Text,
--   email: Text,
--   nama: Text,
--   username: Text,
--   nomor_telepon: Text,
--   role: Text,
--   status: Text,
--   email_verified: Bool,
--   uid_firebase: Text,
--   created_at: Integer,
--   updated_at: Integer
-- }

-- Product/Game type
-- type Game = {
--   id: Text,
--   name: Text,
--   slug: Text,
--   image: Text,
--   price: Text,
--   category: Text,
--   created_at: Integer
-- }

-- Transaction type untuk fraud detection
-- type Transaction = {
--   id: Text,
--   user_id: Text,
--   amount: Number,
--   product: Text,
--   ip: Text,
--   status: Text,
--   created_at: Integer
-- }

-- Audit Log type
-- type AuditLog = {
--   audit_id: Text,
--   action: Text,
--   user_id: Text,
--   ip: Text,
--   details: JSON,
--   timestamp: Integer
-- }

-- Nonce Record type untuk replay attack protection
-- type NonceRecord = {
--   nonce: Text,
--   timestamp: Integer,
--   used: Bool
-- }

-- Rate Limit type
-- type RateLimit = {
--   ip: Text,
--   endpoint: Text,
--   count: Integer,
--   reset_at: Integer
-- }

-- Request Signature type
-- type RequestSignature = {
--   method: Text,
--   path: Text,
--   body: JSON,
--   headers: JSON,
--   timestamp: Integer,
--   nonce: Text,
--   signature: Text
-- }