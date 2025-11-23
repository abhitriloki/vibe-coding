#!/bin/bash

echo "============================================"
echo "AI Coder - Starting Application"
echo "============================================"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "ERROR: Backend dependencies not installed!"
    echo "Please run ./setup.sh first"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "ERROR: Frontend dependencies not installed!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "ERROR: Backend .env file not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

echo "Checking MongoDB connection..."
sleep 2
echo ""

# Function to check if MongoDB is running
check_mongodb() {
    if pgrep -x "mongod" > /dev/null; then
        echo "MongoDB is already running"
        return 0
    else
        return 1
    fi
}

# Start MongoDB if not running
if ! check_mongodb; then
    echo "============================================"
    echo "Starting MongoDB..."
    echo "============================================"

    # Create data directory if it doesn't exist
    mkdir -p data/db

    # Try to start MongoDB
    if command -v mongod &> /dev/null; then
        mongod --dbpath data/db --fork --logpath data/mongodb.log
        sleep 2
        echo "MongoDB started successfully!"
    else
        echo "WARNING: MongoDB not found. Make sure it's installed or use MongoDB Atlas"
    fi
    echo ""
fi

echo "============================================"
echo "Starting Backend Server (Port 5000)..."
echo "============================================"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 3
echo ""

echo "============================================"
echo "Starting Frontend Server (Port 5173)..."
echo "============================================"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo ""

# Save PIDs to file for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "============================================"
echo "Application is running!"
echo "============================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo "Or run ./stop.sh to stop the application"
echo "============================================"
echo ""

# Wait for user interrupt
trap 'echo ""; echo "Stopping services..."; ./stop.sh; exit' INT
wait
