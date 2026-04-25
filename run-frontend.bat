@echo off
title FFMS Frontend Dev Server
color 0B

echo ==========================================
echo    FFMS Frontend - Starting Dev Server...
echo ==========================================
echo.

cd /d "d:\cap2\ffms-frontend"

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting frontend dev server (Vite)...
echo.
call npm run dev

pause
