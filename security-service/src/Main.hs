{-# LANGUAGE OverloadedStrings #-}
-- Main.hs - Entry point Security Service Haskell
-- TODO: Implementasi server Haskell menggunakan Scotty atau Servant

module Main where

import Network.Wai (Application)
-- TODO: Import Web.Framework (Scotty atau Servant)
-- import Web.Scotty
-- import Servant.Server

-- TODO: Import Config
-- import Config (SecurityConfig, loadConfig)

-- TODO: Import Routes
-- import Routes (securityAPI, server)

main :: IO ()
main = do
    -- TODO: Load konfigurasi dari environment variable
    -- config <- loadConfig
    
    -- TODO: Jalankan server
    -- scotty (configPort config) $ do
    --     middleware logger
    --     routes
    
    putStrLn "Security Service belum diimplementasikan. Lihat file TODO."