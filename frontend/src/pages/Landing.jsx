import { Link } from 'react-router-dom';
import { Code2, Sparkles, Layout, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary-bg">
      <nav className="border-b border-primary-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary-accent" />
              <span className="text-xl font-bold text-primary-text">AI Coder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-primary-textSecondary hover:text-primary-text transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-text mb-6">
              Build Websites with
              <span className="text-primary-accent"> AI Power</span>
            </h1>
            <p className="text-xl text-primary-textSecondary mb-8 max-w-3xl mx-auto">
              Describe what you want to build, and watch AI generate clean, professional code instantly.
              Perfect for developers, designers, and anyone who wants to create web projects faster.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-primary-accent hover:bg-blue-600 text-white text-lg font-medium rounded-lg transition"
              >
                Start Building Free
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-primary-border hover:border-primary-accent text-primary-text text-lg font-medium rounded-lg transition"
              >
                Learn More
              </a>
            </div>
          </div>

          <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-panel p-8 rounded-lg border border-primary-border">
              <div className="bg-primary-accent bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">AI-Powered Generation</h3>
              <p className="text-primary-textSecondary">
                Describe your ideas in plain English and let AI generate HTML, CSS, and JavaScript code instantly.
              </p>
            </div>

            <div className="bg-primary-panel p-8 rounded-lg border border-primary-border">
              <div className="bg-primary-accent bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Three-Panel Interface</h3>
              <p className="text-primary-textSecondary">
                Chat with AI, edit code in a professional editor, and see live previews all in one screen.
              </p>
            </div>

            <div className="bg-primary-panel p-8 rounded-lg border border-primary-border">
              <div className="bg-primary-accent bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Instant Preview</h3>
              <p className="text-primary-textSecondary">
                See your changes come to life instantly with real-time preview and responsive design testing.
              </p>
            </div>
          </div>

          <div className="mt-32 bg-primary-panel p-12 rounded-lg border border-primary-border text-center">
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              Ready to build something amazing?
            </h2>
            <p className="text-xl text-primary-textSecondary mb-8">
              Join developers using AI to create faster and smarter.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-primary-accent hover:bg-blue-600 text-white text-lg font-medium rounded-lg transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-primary-accent" />
              <span className="text-primary-textSecondary">© 2024 AI Coder</span>
            </div>
            <div className="text-primary-textSecondary">
              Built with React, Monaco Editor, and AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
