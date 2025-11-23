# AI Coder - Installation Guide

This guide will help you set up and run the AI Coder platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Optional - you can use MongoDB Atlas instead)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Git** (to clone the repository)
   - Download: https://git-scm.com/

## Quick Start (Windows)

### Option 1: One-Click Start (Easiest)

1. Double-click `quick-start.bat`
2. Follow the on-screen menu
3. The script will:
   - Install all dependencies
   - Set up configuration
   - Start MongoDB (if installed)
   - Start backend and frontend servers
   - Open your browser automatically

### Option 2: Step-by-Step

1. **First Time Setup**
   ```
   Double-click setup.bat
   ```
   This will:
   - Check Node.js and MongoDB installation
   - Install all dependencies
   - Create configuration files

2. **Start the Application**
   ```
   Double-click start.bat
   ```
   This will:
   - Start MongoDB
   - Start backend server (port 5000)
   - Start frontend server (port 5173)
   - Open your browser

3. **Stop the Application**
   ```
   Double-click stop.bat
   ```
   Or close all terminal windows

## Quick Start (Linux/Mac)

### Option 1: One-Click Start

```bash
# Make scripts executable (first time only)
chmod +x setup.sh start.sh stop.sh

# Run setup
./setup.sh

# Start application
./start.sh
```

### Option 2: Step-by-Step

1. **First Time Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start the Application**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Stop the Application**
   ```bash
   chmod +x stop.sh
   ./stop.sh
   ```
   Or press `Ctrl+C` in the terminal

## Manual Installation

If you prefer to install manually:

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-coder
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
ENCRYPTION_KEY=your-32-character-encryption-key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

```bash
# Windows
mongod

# Linux/Mac
mongod --dbpath ./data/db
```

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

### 6. Start Frontend Server

```bash
cd frontend
npm run dev
```

### 7. Open Browser

Navigate to: http://localhost:5173

## Using MongoDB Atlas (Cloud Database)

If you don't want to install MongoDB locally:

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-coder
   ```
5. Skip starting MongoDB locally

## Configuration

### API Keys Setup

After starting the application:

1. Register/Login to your account
2. Go to **Settings** page
3. Add your AI provider API keys:
   - **OpenRouter**: https://openrouter.ai/keys
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Anthropic**: https://console.anthropic.com/settings/keys
4. Test the connection
5. Save settings

### Security Configuration

For production use, make sure to:

1. Change `JWT_SECRET` to a strong random string
2. Change `ENCRYPTION_KEY` to a 32-character random string
3. Use strong passwords
4. Enable HTTPS
5. Configure proper CORS settings

## Troubleshooting

### Port Already in Use

If you get an error about ports being in use:

**Windows:**
```bash
# Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Check what's using the port
lsof -i :5000
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Failed

1. **Check if MongoDB is running:**
   - Windows: Check Task Manager for `mongod.exe`
   - Linux/Mac: Run `pgrep mongod`

2. **Check MongoDB URI in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-coder
   ```

3. **Create data directory:**
   ```bash
   mkdir -p data/db
   ```

4. **Or use MongoDB Atlas** (see above)

### Dependencies Installation Failed

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be v16 or higher
   ```

### Can't Access Application

1. **Check if servers are running:**
   - Backend should show: `Server running on port 5000`
   - Frontend should show: `Local: http://localhost:5173`

2. **Check firewall settings:**
   - Allow Node.js through firewall
   - Allow ports 5000 and 5173

3. **Try different browser:**
   - Clear cache
   - Try incognito mode

### AI Chat Not Working

1. **Check API keys in Settings:**
   - Make sure you've added at least one API key
   - Test the connection using the "Test" button

2. **Check backend logs:**
   - Look for error messages in the backend terminal

3. **Check your API key balance:**
   - Make sure your API key has credits

## Project Structure

```
ai-coder/
├── backend/              # Node.js backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Context providers
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── vite.config.js
├── setup.bat           # Windows setup script
├── start.bat           # Windows start script
├── stop.bat            # Windows stop script
├── quick-start.bat     # Windows all-in-one script
├── setup.sh            # Linux/Mac setup script
├── start.sh            # Linux/Mac start script
├── stop.sh             # Linux/Mac stop script
└── README.md           # Documentation
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Default Ports

- Frontend: 5173
- Backend: 5000
- MongoDB: 27017

## Next Steps

1. Register a new account
2. Add your API keys in Settings
3. Create your first project
4. Start building with AI!

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the README.md
- Check backend/frontend logs for errors

## Scripts Summary

| Script | Windows | Linux/Mac | Description |
|--------|---------|-----------|-------------|
| Setup | `setup.bat` | `./setup.sh` | First-time installation |
| Start | `start.bat` | `./start.sh` | Start all services |
| Stop | `stop.bat` | `./stop.sh` | Stop all services |
| Quick Start | `quick-start.bat` | N/A | All-in-one menu |

---

**Happy Coding with AI! 🚀**
