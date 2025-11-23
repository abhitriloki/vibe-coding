@echo off
title AI Coder - Quick Start
color 0A

echo.
echo  ========================================
echo    ___    ___    ____          __
echo   / _ \  /_ _/  / __/__  ___/ /__ ____
echo  / // / / /   / /__ / _ \/ _  / -_) __/
echo /____/ /___/ /____/\___/\_,_/\__/_/
echo.
echo  AI-Powered Web Development Platform
echo  ========================================
echo.

REM Check if setup has been run
if not exist backend\node_modules (
    echo First time setup detected...
    echo.
    call setup.bat
    if %errorlevel% neq 0 (
        echo Setup failed! Please check the errors above.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo  Quick Start Menu
echo ========================================
echo.
echo  1. Start Application (with MongoDB)
echo  2. Start Application (without MongoDB - using Atlas)
echo  3. Run Setup Again
echo  4. Stop All Services
echo  5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start_with_mongo
if "%choice%"=="2" goto start_without_mongo
if "%choice%"=="3" goto run_setup
if "%choice%"=="4" goto stop_services
if "%choice%"=="5" goto end

:start_with_mongo
echo.
echo Starting application with local MongoDB...
call start.bat
goto end

:start_without_mongo
echo.
echo Starting application without MongoDB (make sure MongoDB Atlas URI is configured in backend/.env)
echo.
echo Starting Backend Server...
start "AI Coder Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "AI Coder Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Application started! Opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173
echo.
echo To stop: Close the terminal windows or run stop.bat
pause
goto end

:run_setup
echo.
call setup.bat
pause
goto end

:stop_services
echo.
call stop.bat
goto end

:end
exit
