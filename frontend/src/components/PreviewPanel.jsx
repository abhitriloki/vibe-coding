import { useState, useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react';

const PreviewPanel = ({ htmlCode, cssCode, jsCode }) => {
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState('desktop');
  const iframeRef = useRef(null);

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;

    if (!document) return;

    const combinedHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          console.log = function(...args) {
            window.parent.postMessage({ type: 'console', data: args }, '*');
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'error', data: args }, '*');
          };

          try {
            ${jsCode}
          } catch (error) {
            console.error('Error:', error.message);
          }
        </script>
      </body>
      </html>
    `;

    document.open();
    document.write(combinedHTML);
    document.close();
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    updatePreview();
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const getIframeWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="h-full flex flex-col bg-primary-panel">
      <div className="p-4 border-b border-primary-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-text">Live Preview</h2>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-primary-bg rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded transition ${
                  viewMode === 'desktop'
                    ? 'bg-primary-accent text-white'
                    : 'text-primary-textSecondary hover:text-primary-text'
                }`}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded transition ${
                  viewMode === 'tablet'
                    ? 'bg-primary-accent text-white'
                    : 'text-primary-textSecondary hover:text-primary-text'
                }`}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded transition ${
                  viewMode === 'mobile'
                    ? 'bg-primary-accent text-white'
                    : 'text-primary-textSecondary hover:text-primary-text'
                }`}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 text-primary-textSecondary hover:text-primary-text transition"
              title="Refresh preview"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-primary-textSecondary hover:text-primary-text transition"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white flex justify-center">
        <iframe
          key={key}
          ref={iframeRef}
          title="preview"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          className="w-full h-full border-0 bg-white transition-all duration-300"
          style={{ width: getIframeWidth(), maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
