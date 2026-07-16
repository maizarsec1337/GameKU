{-# LANGUAGE DeriveGeneric #-}
-- Types.hs - Definisi tipe data Security Service
-- TODO: Implementasi tipe data menggunakan Aeson

module Types where

import GHC.Generics (Generic)
-- TODO: Import Data.Aeson untuk JSON serialization
-- import Data.Aeson

-- TODO: Definisi tipe data User
-- data User = User
--     { userId :: String
--     , email :: String
--     , nama :: String
--     , username :: String
--     , nomorTelepon :: String
--     , role :: String
--     , status :: String
--     , emailVerified :: Bool
--     , uidFirebase :: String
--     } deriving (Show, Generic)

-- TODO: Definisi tipe data Game
-- data Game = Game
--     { gameId :: String
--     , name :: String
--     , slug :: String
--     , image :: String
--     , price :: String
--     , category :: String
--     } deriving (Show, Generic)

-- TODO: Definisi tipe data Transaction untuk fraud detection
-- data Transaction = Transaction
--     { transactionId :: String
--     , userId :: String
--     , amount :: Double
--     , product :: String
--     , ip :: String
--     } deriving (Show, Generic)

-- TODO: Definisi tipe data Request untuk validasi
-- data RequestValidation = RequestValidation
--     { method :: String
--     , path :: String
--     , body :: String  -- JSON string
--     , headers :: [(String, String)]
--     , timestamp :: Integer
--     , nonce :: String
--     } deriving (Show, Generic)

-- TODO: Definisi tipe data AuditLog
-- data AuditLog = AuditLog
--     { auditId :: String
--     , action :: String
--     , userId :: String
--     , ip :: String
--     , details :: String  -- JSON string
--     , timestamp :: Integer
--     } deriving (Show, Generic)

-- TODO: Definisi tipe data NonceRecord
-- data NonceRecord = NonceRecord
--     { nonceValue :: String
--     , nonceTimestamp :: Integer
--     , nonceUsed :: Bool
--     } deriving (Show, Generic)