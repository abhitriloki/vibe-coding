@echo off
echo ============================================
echo AI Coder - Initial Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed:
node --version
echo.

REM Check if MongoDB is installed
echo [2/6] Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB is not installed or not in PATH!
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo Or use MongoDB Atlas (cloud database)
    echo.
) else (
    echo MongoDB is installed:
    mongod --version | findstr "version"
    echo.
)

REM Create .env file for backend if it doesn't exist
echo [3/6] Setting up environment variables...
if not exist backend\.env (
    echo Creating backend/.env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/ai-coder
        echo JWT_SECRET=ai-coder-secret-key-change-this-in-production-%RANDOM%
        echo JWT_EXPIRE=7d
        echo ENCRYPTION_KEY=your-32-char-encryption-key-here
        echo NODE_ENV=development
        echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo .env file created successfully!
) else (
    echo .env file already exists, skipping...
)
echo.

REM Install backend dependencies
echo [4/6] Installing backend dependencies...
cd backend
if exist package-lock.json (
    echo Cleaning old dependencies...
    rmdir /s /q node_modules 2>nul
    del package-lock.json 2>nul
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully!
echo.

REM Install frontend dependencies
echo [5/6] Installing frontend dependencies...
cd frontend
if exist package-lock.json (
    echo Cleaning old dependencies...
    rmdir /s /q node_modules 2>nul
    del package-lock.json 2>nul
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

REM Setup complete
echo [6/6] Setup completed successfully!
echo.
echo ============================================
echo Next Steps:
echo ============================================
echo 1. Make sure MongoDB is running:
echo    - If using local MongoDB, run: mongod
echo    - If using MongoDB Atlas, update MONGODB_URI in backend/.env
echo.
echo 2. Configure your AI API keys:
echo    - After starting the app, go to Settings
echo    - Add your OpenRouter, OpenAI, or Anthropic API key
echo.
echo 3. Start the application:
echo    - Run: start.bat
echo    - Or manually:
echo      * Backend: cd backend ^&^& npm run dev
echo      * Frontend: cd frontend ^&^& npm run dev
echo.
echo ============================================
pause
