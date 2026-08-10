@echo off
title MedLink India Backend Server
echo ========================================================
echo   Starting MedLink India Backend API Server (Port 5000)...
echo ========================================================
cd /d "%~dp0"
npm run dev
pause
