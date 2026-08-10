@echo off
title MedLink India Mobile App
echo ========================================================
echo   Starting MedLink India Flutter Application...
echo ========================================================
set PATH=C:\src\flutter\bin;%PATH%
cd /d "%~dp0"
C:\src\flutter\bin\flutter.bat run -d chrome
pause
