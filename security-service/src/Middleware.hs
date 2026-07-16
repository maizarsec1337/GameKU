{-# LANGUAGE OverloadedStrings #-}
-- Middleware.hs - Middleware keamanan untuk Security Service
-- TODO: Implementasi middleware untuk HTTP server

module Middleware where

import Network.Wai (Middleware)
-- TODO: Import wai-extra untuk middleware
-- import Network.Wai.Middleware.RequestLogger
-- import Network.Wai.Middleware.Gzip
-- import Network.Wai.Middleware.Cors

-- TODO: Security headers middleware
securityHeaders :: Middleware
securityHeaders = id
    -- TODO: Implementasi Security Header
    -- Tambahkan header:
    -- - X-Content-Type-Options: nosniff
    -- - X-Frame-Options: DENY
    -- - X-XSS-Protection: 1; mode=block
    -- - Content-Security-Policy: default-src 'self'
    -- - Strict-Transport-Security: max-age=31536000; includeSubDomains

-- TODO: CORS middleware
corsMiddleware :: Middleware
corsMiddleware = id
    -- TODO: Implementasi CORS
    -- fromList $
    --     [ "Access-Control-Allow-Origin" =: "*"
    --     , "Access-Control-Allow-Methods" =: "POST, GET, OPTIONS"
    --     , "Access-Control-Allow-Headers" =: "Content-Type, X-Timestamp, X-Nonce, X-Signature"
    --     ]

-- TODO: Request size limit middleware
requestSizeLimit :: Int -> Middleware
requestSizeLimit maxSize = id
    -- TODO: Implementasi request size limit
    -- maximumRequestBodySize maxSize

-- TODO: API key validation middleware
apiKeyValidation :: String -> Middleware
apiKeyValidation expectedApiKey = id
    -- TODO: Implementasi API Signature
    -- Validasi X-API-Key header