@echo off
title MedLink India Master Ecosystem Launcher
echo ========================================================
echo   MedLink India - Healthcare OS Master Launcher
echo ========================================================
echo Starting Backend Express API Server (Port 5000)...
start "MedLink Backend API" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Starting React Web Ecosystem (Port 5173)...
start "MedLink React Web App" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Starting Flutter App (Chrome)...
start "MedLink Flutter App" cmd /k "cd /d "%~dp0mobile" && run_app.bat"

echo ========================================================
echo   All Ecosystem Systems Launched Live!
echo   - Backend Server: http://localhost:5000/api/v1
echo   - React Web App:  http://localhost:5173
echo   - Flutter App:    Launching Chrome...
echo ========================================================
