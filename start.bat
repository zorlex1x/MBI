@echo off
title MBI - Modern Bank Of India - Launcher
echo =======================================================
echo          MBI - MODERN BANK OF INDIA
echo =======================================================
echo Starting Java Spring Boot Backend (Port 8080)...
start "MBI Bank Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo Starting React Vite Frontend (Port 5173)...
start "MBI Bank Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8080
echo.
timeout /t 5 >nul
start http://localhost:5173
exit
