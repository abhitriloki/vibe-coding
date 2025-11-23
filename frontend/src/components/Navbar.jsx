import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Home, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-panel border-b border-primary-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary-accent" />
            <span className="text-xl font-bold text-primary-text">AI Coder</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 text-primary-textSecondary hover:text-primary-text transition"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-primary-textSecondary hover:text-primary-text transition"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-bg hover:bg-primary-border rounded-lg transition"
              >
                <User className="h-5 w-5 text-primary-accent" />
                <span className="text-primary-text">{user?.name}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-primary-panel border border-primary-border rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-primary-textSecondary hover:bg-primary-bg transition"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
