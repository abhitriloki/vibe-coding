#!/bin/bash

echo "============================================"
echo "AI Coder - Stopping Application"
echo "============================================"
echo ""

# Kill backend process
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    rm .backend.pid
fi

# Kill frontend process
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
    fi
    rm .frontend.pid
fi

# Kill any remaining node processes for this project
echo "Cleaning up Node.js processes..."
pkill -f "vibe-coding/backend" 2>/dev/null
pkill -f "vibe-coding/frontend" 2>/dev/null

# Optionally stop MongoDB (commented out by default)
# echo "Stopping MongoDB..."
# pkill mongod 2>/dev/null

echo ""
echo "============================================"
echo "All services stopped!"
echo "============================================"
echo ""
