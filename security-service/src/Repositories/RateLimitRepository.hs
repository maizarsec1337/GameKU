{-# LANGUAGE OverloadedStrings #-}
-- Repositories/RateLimitRepository.hs - Repository untuk Rate Limit
-- TODO: Implementasi rate limit storage di MongoDB

module Repositories.RateLimitRepository where

-- TODO: Import Database
-- import Database.MongoDB

-- TODO: Cek rate limit
checkRateLimit :: String -> String -> Int -> Int -> IO (Bool, Int, Integer)
checkRateLimit ip endpoint limit windowSeconds = do
    -- TODO: Cek di MongoDB rate_limits collection
    -- Query: { ip, endpoint, reset_at: { $lt: now } }
    -- Jika tidak ada atau reset_at sudah lewat, buat entry baru
    -- Jika count < limit, increment count
    -- return (allowed, remaining, resetAt)
    return (True, limit, 0)

-- TODO: Increment rate limit counter
incrementRateLimit :: String -> String -> Int -> IO Int
incrementRateLimit ip endpoint windowSeconds = do
    -- TODO: Update counter di MongoDB
    -- return newCount
    return 1

-- TODO: Reset rate limit
resetRateLimit :: String -> String -> IO ()
resetRateLimit ip endpoint = do
    -- TODO: Hapus entry rate limit
    return ()

-- TODO: Cleanup rate limits kadaluarsa
cleanupExpiredRateLimits :: Integer -> IO ()
cleanupExpiredRateLimits currentTime = do
    -- TODO: Hapus rate limits yang sudah kadaluarsa
    return ()