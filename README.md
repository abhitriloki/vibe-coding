# AI Coder - Web-Based AI Coding Platform

A production-ready web application that enables users to build websites using AI assistance. Chat with AI to describe what you want, see the code generated in real-time, and preview your creation instantly.

## Features

### Core Functionality
- **User Authentication System**: Secure login/registration with JWT tokens
- **Three-Panel Interface**: AI chat, code editor, and live preview in one view
- **AI Integration**: Support for OpenRouter, OpenAI, and Anthropic APIs
- **Monaco Editor**: Professional code editing with syntax highlighting
- **Live Preview**: Real-time rendering with responsive design testing
- **Project Management**: Save, load, and delete projects
- **Download Projects**: Export complete projects as ZIP files

### Security
- Encrypted API key storage with AES encryption
- JWT-based authentication
- Rate limiting on API endpoints
- Input sanitization
- Secure password hashing with bcrypt
- CORS protection

### Design
- Modern dark theme interface
- Responsive design for desktop users
- Resizable panels for custom layouts
- Professional UI with smooth transitions

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Monaco Editor (VS Code editor)
- React Router for navigation
- React Split for resizable panels
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB for database
- JWT authentication
- Bcrypt for password hashing
- Crypto-JS for API key encryption
- Archiver for ZIP generation
- Express Rate Limit for protection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- API keys from OpenRouter, OpenAI, or Anthropic

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-coder
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:

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

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or sign in
2. **Configure API Keys**: Go to Settings and add your AI provider API keys
3. **Create Project**: Click "New Project" in the dashboard
4. **Chat with AI**: Describe what you want to build in the chat panel
5. **Edit Code**: Modify the generated code in the editor
6. **Preview**: See your changes live in the preview panel
7. **Save/Download**: Save your project or download it as a ZIP

## Getting API Keys

- **OpenRouter**: https://openrouter.ai/keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/settings/keys

## Project Structure

```
ai-coder/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── styles/      # CSS styles
│   └── vite.config.js   # Vite configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/api-keys` - Update API keys
- `GET /api/auth/api-keys` - Get API keys

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/test` - Test API connection

### Download
- `GET /api/download/:id` - Download project as ZIP

## Features in Detail

### Three-Panel Layout
- **Left Panel (30%)**: AI Assistant chatbot for describing requirements
- **Center Panel (40%)**: Monaco Editor with HTML/CSS/JavaScript tabs
- **Right Panel (30%)**: Live preview with responsive design modes

### Code Editor
- Syntax highlighting for HTML, CSS, JavaScript
- Line numbers and code folding
- Auto-completion and IntelliSense
- Dark theme matching VS Code
- Save and copy functionality

### Live Preview
- Real-time rendering
- Responsive preview modes (desktop, tablet, mobile)
- Open in new tab option
- Refresh button

### AI Integration
- Automatic code extraction from AI responses
- Support for multiple AI providers
- Conversation history saved with projects
- Auto-save after AI responses

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using React, Monaco Editor, and AI
