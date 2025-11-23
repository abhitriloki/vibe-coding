import { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

const ChatPanel = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-primary-panel">
      <div className="p-4 border-b border-primary-border">
        <h2 className="text-lg font-semibold text-primary-text">AI Assistant</h2>
        <p className="text-sm text-primary-textSecondary">
          Describe what you want to build
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
        {messages.length === 0 ? (
          <div className="text-center text-primary-textSecondary py-8">
            <p className="mb-2">Start a conversation!</p>
            <p className="text-sm">Try: "Build a todo list app with modern design"</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-accent text-white'
                    : 'bg-primary-bg text-primary-text'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-primary-bg px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 text-primary-accent animate-spin" />
                <span className="text-sm text-primary-textSecondary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-primary-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-primary-bg border border-primary-border rounded-lg text-primary-text placeholder-primary-textSecondary focus:outline-none focus:border-primary-accent transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
