@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
echo ====================================================================
echo   Starting Enterprise Digital Pathology Platform (OSD + libvips API)
echo ====================================================================

start "Digital Pathology Backend API" cmd /k "node server/server.mjs"
start "Digital Pathology Viewer UI" cmd /k "npm run preview -- --port 3000 --host 0.0.0.0"

echo [READY] Backend running at http://localhost:4000
echo [READY] Viewer running at http://localhost:3000
