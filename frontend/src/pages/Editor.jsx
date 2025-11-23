import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Split from 'react-split';
import { projectAPI, aiAPI, downloadAPI } from '../services/api';
import { ArrowLeft, Download } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectAPI.getProject(id);
      const projectData = response.data;
      setProject(projectData);
      setHtmlCode(projectData.htmlCode || '');
      setCssCode(projectData.cssCode || '');
      setJsCode(projectData.jsCode || '');
      setMessages(projectData.chatHistory || []);
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (type, value) => {
    switch (type) {
      case 'html':
        setHtmlCode(value);
        break;
      case 'css':
        setCssCode(value);
        break;
      case 'js':
        setJsCode(value);
        break;
    }
  };

  const handleSaveProject = async () => {
    try {
      await projectAPI.updateProject(id, {
        htmlCode,
        cssCode,
        jsCode,
        chatHistory: messages
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  const extractCodeFromResponse = (response) => {
    const codeBlocks = {
      html: '',
      css: '',
      js: ''
    };

    // Try to extract code blocks with language tags
    const htmlMatch = response.match(/```html\n([\s\S]*?)```/i);
    const cssMatch = response.match(/```css\n([\s\S]*?)```/i);
    const jsMatch = response.match(/```(?:javascript|js)\n([\s\S]*?)```/i);

    if (htmlMatch) codeBlocks.html = htmlMatch[1].trim();
    if (cssMatch) codeBlocks.css = cssMatch[1].trim();
    if (jsMatch) codeBlocks.js = jsMatch[1].trim();

    // If no code blocks found, try to extract from the full response
    if (!htmlMatch && !cssMatch && !jsMatch) {
      // Look for any code blocks
      const anyCodeMatch = response.match(/```\n([\s\S]*?)```/);
      if (anyCodeMatch) {
        const code = anyCodeMatch[1].trim();
        // Try to guess the type based on content
        if (code.includes('<!DOCTYPE') || code.includes('<html')) {
          codeBlocks.html = code;
        } else if (code.includes('{') && code.includes('}') && !code.includes('function')) {
          codeBlocks.css = code;
        } else {
          codeBlocks.js = code;
        }
      }
    }

    return codeBlocks;
  };

  const handleSendMessage = async (message) => {
    const userMessage = { role: 'user', content: message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setAiLoading(true);

    try {
      const systemMessage = {
        role: 'system',
        content: 'You are a helpful web development assistant. Generate clean, modern HTML, CSS, and JavaScript code. Always wrap code in appropriate code blocks with language tags (```html, ```css, ```javascript). Be concise and focus on the code.'
      };

      const response = await aiAPI.chat([systemMessage, ...newMessages]);
      const aiMessage = { role: 'assistant', content: response.data.message };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

      // Extract and update code
      const extractedCode = extractCodeFromResponse(response.data.message);

      if (extractedCode.html) {
        setHtmlCode(extractedCode.html);
      }
      if (extractedCode.css) {
        setCssCode(extractedCode.css);
      }
      if (extractedCode.js) {
        setJsCode(extractedCode.js);
      }

      // Auto-save after AI response
      setTimeout(() => {
        projectAPI.updateProject(id, {
          htmlCode: extractedCode.html || htmlCode,
          cssCode: extractedCode.css || cssCode,
          jsCode: extractedCode.js || jsCode,
          chatHistory: updatedMessages
        });
      }, 500);

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure you have configured your API keys in Settings.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadAPI.downloadProject(id, project.name);
    } catch (error) {
      console.error('Failed to download project:', error);
      alert('Failed to download project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-primary-bg">
      <div className="bg-primary-panel border-b border-primary-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-primary-textSecondary hover:text-primary-text transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={project?.name || ''}
            onChange={(e) => {
              setProject({ ...project, name: e.target.value });
              projectAPI.updateProject(id, { name: e.target.value });
            }}
            className="text-xl font-semibold bg-transparent text-primary-text border-none focus:outline-none"
          />
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition"
        >
          <Download className="h-5 w-5" />
          <span>Download</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[30, 40, 30]}
          minSize={[250, 300, 250]}
          gutterSize={8}
          snapOffset={30}
        >
          <div className="h-full overflow-hidden">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={aiLoading}
            />
          </div>

          <div className="h-full overflow-hidden">
            <EditorPanel
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
              onCodeChange={handleCodeChange}
              onSave={handleSaveProject}
            />
          </div>

          <div className="h-full overflow-hidden">
            <PreviewPanel
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
            />
          </div>
        </Split>
      </div>
    </div>
  );
};

export default Editor;
