@echo off
echo ============================================
echo AI Coder - Starting Application
echo ============================================
echo.

REM Check if dependencies are installed
if not exist backend\node_modules (
    echo ERROR: Backend dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

if not exist frontend\node_modules (
    echo ERROR: Frontend dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist backend\.env (
    echo ERROR: Backend .env file not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul
echo.

echo ============================================
echo Starting MongoDB (if not already running)...
echo ============================================
start "MongoDB" cmd /k "mongod --dbpath data\db || echo MongoDB may already be running or data\db folder does not exist. Create it or use MongoDB Atlas."
timeout /t 3 /nobreak >nul
echo.

echo ============================================
echo Starting Backend Server (Port 5000)...
echo ============================================
start "AI Coder Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.

echo ============================================
echo Starting Frontend Server (Port 5173)...
echo ============================================
start "AI Coder Frontend" cmd /k "cd frontend && npm run dev"
echo.

echo ============================================
echo Application is starting!
echo ============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Three terminal windows have been opened:
echo 1. MongoDB
echo 2. Backend Server
echo 3. Frontend Server
echo.
echo The application will open automatically in your browser...
echo.
timeout /t 5 /nobreak >nul

REM Open browser
start http://localhost:5173

echo ============================================
echo To stop the application:
echo Close all three terminal windows
echo ============================================
echo.
pause
