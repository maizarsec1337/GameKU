{-# LANGUAGE OverloadedStrings #-}
-- Config.hs - Konfigurasi Security Service
-- TODO: Implementasi konfigurasi dari environment variable

module Config where

import System.Environment (getEnv)
-- TODO: Import Data Aeson untuk parsing JSON config

data SecurityConfig = SecurityConfig
    { host :: String
    , port :: Int
    , secretKey :: String
    , jwtSecret :: String
    , mongodbUri :: String
    , mongodbDb :: String
    , nonceExpiry :: Int
    , rateLimitWindow :: Int
    , rateLimitMax :: Int
    } deriving (Show)

-- TODO: Load konfigurasi dari environment variable
loadConfig :: IO SecurityConfig
loadConfig = do
    -- host <- getEnv "SECURITY_SERVICE_HOST"
    -- portStr <- getEnv "SECURITY_SERVICE_PORT"
    -- secretKey <- getEnv "SECURITY_SECRET_KEY"
    -- jwtSecret <- getEnv "JWT_SECRET"
    -- mongodbUri <- getEnv "MONGODB_URI"
    -- mongodbDb <- getEnv "MONGODB_DB"
    
    -- TODO: Parse environment variables
    return $ SecurityConfig
        { host = "0.0.0.0"
        , port = 8080
        , secretKey = ""
        , jwtSecret = ""
        , mongodbUri = "mongodb://localhost:27017"
        , mongodbDb = "gameku"
        , nonceExpiry = 300
        , rateLimitWindow = 60
        , rateLimitMax = 100
        }