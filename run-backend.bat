@echo off
title FFMS Backend Server
color 0A

echo ==========================================
echo    FFMS Backend - Starting Server...
echo ==========================================
echo.

cd /d "d:\cap2\ffms-backend"

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting backend server (nodemon)...
echo.
call npm run dev

pause
