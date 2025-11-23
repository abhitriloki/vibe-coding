#!/bin/bash

echo "============================================"
echo "AI Coder - Initial Setup Script"
echo "============================================"
echo ""

# Check if Node.js is installed
echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js is installed:"
node --version
echo ""

# Check if MongoDB is installed
echo "[2/6] Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB is not installed or not in PATH!"
    echo "Please install MongoDB from https://www.mongodb.com/try/download/community"
    echo "Or use MongoDB Atlas (cloud database)"
    echo ""
else
    echo "MongoDB is installed:"
    mongod --version | grep "version"
    echo ""
fi

# Create .env file for backend if it doesn't exist
echo "[3/6] Setting up environment variables..."
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-coder
JWT_SECRET=ai-coder-secret-key-change-this-in-production-$RANDOM
JWT_EXPIRE=7d
ENCRYPTION_KEY=your-32-char-encryption-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
    echo ".env file created successfully!"
else
    echo ".env file already exists, skipping..."
fi
echo ""

# Install backend dependencies
echo "[4/6] Installing backend dependencies..."
cd backend
if [ -f package-lock.json ]; then
    echo "Cleaning old dependencies..."
    rm -rf node_modules package-lock.json
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    cd ..
    exit 1
fi
cd ..
echo "Backend dependencies installed successfully!"
echo ""

# Install frontend dependencies
echo "[5/6] Installing frontend dependencies..."
cd frontend
if [ -f package-lock.json ]; then
    echo "Cleaning old dependencies..."
    rm -rf node_modules package-lock.json
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    cd ..
    exit 1
fi
cd ..
echo "Frontend dependencies installed successfully!"
echo ""

# Setup complete
echo "[6/6] Setup completed successfully!"
echo ""
echo "============================================"
echo "Next Steps:"
echo "============================================"
echo "1. Make sure MongoDB is running:"
echo "   - If using local MongoDB, run: mongod"
echo "   - If using MongoDB Atlas, update MONGODB_URI in backend/.env"
echo ""
echo "2. Configure your AI API keys:"
echo "   - After starting the app, go to Settings"
echo "   - Add your OpenRouter, OpenAI, or Anthropic API key"
echo ""
echo "3. Start the application:"
echo "   - Run: ./start.sh"
echo "   - Or manually:"
echo "     * Backend: cd backend && npm run dev"
echo "     * Frontend: cd frontend && npm run dev"
echo ""
echo "============================================"
