import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Copy, Check } from 'lucide-react';

const EditorPanel = ({ htmlCode, cssCode, jsCode, onCodeChange, onSave }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      default: return '';
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      default: return 'html';
    }
  };

  const handleEditorChange = (value) => {
    onCodeChange(activeTab, value || '');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setTimeout(() => setSaving(false), 1000);
  };

  const tabs = [
    { id: 'html', label: 'HTML', file: 'index.html' },
    { id: 'css', label: 'CSS', file: 'styles.css' },
    { id: 'js', label: 'JavaScript', file: 'script.js' }
  ];

  return (
    <div className="h-full flex flex-col bg-primary-panel">
      <div className="border-b border-primary-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t transition ${
                  activeTab === tab.id
                    ? 'bg-primary-editor text-primary-accent border-b-2 border-primary-accent'
                    : 'text-primary-textSecondary hover:text-primary-text'
                }`}
              >
                {tab.file}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-primary-textSecondary hover:text-primary-text transition"
              title="Copy code"
            >
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-accent hover:bg-blue-600 text-white rounded transition disabled:opacity-50"
              title="Save project"
            >
              <Save className="h-4 w-4" />
              <span className="text-sm">{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage()}
          value={getCode()}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
