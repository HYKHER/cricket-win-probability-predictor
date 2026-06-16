@echo off
REM Cricket Analytics Platform - Startup Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        Cricket Analytics Platform - Startup                ║
echo ║              Windows Setup & Launch Script                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo 📥 Please install Python from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Start backend
echo.
echo 🚀 Starting Flask Backend...
echo 📍 Backend running on http://localhost:5000
echo.
start python app.py

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Open frontend in browser
echo.
echo 🌐 Opening Frontend...
cd ..\frontend

REM Start simple HTTP server
echo.
echo 📍 Frontend running on http://localhost:8000
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   Ready to Use! 🎉                         ║
echo ║                                                             ║
echo ║  Backend:  http://localhost:5000                           ║
echo ║  Frontend: http://localhost:8000                           ║
echo ║                                                             ║
echo ║  📖 Open frontend/index.html in your browser              ║
echo ║  or                                                        ║
echo ║  python -m http.server 8000                                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
