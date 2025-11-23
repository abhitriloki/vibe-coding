import { useState, useEffect } from 'react';
import { authAPI, aiAPI } from '../services/api';
import { Save, CheckCircle, XCircle, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [apiKeys, setApiKeys] = useState({
    openRouter: '',
    openAI: '',
    anthropic: '',
    preferredProvider: 'openrouter'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState({});
  const [testResults, setTestResults] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await authAPI.getApiKeys();
      setApiKeys(response.data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value
    });
    setTestResults({
      ...testResults,
      [e.target.name]: null
    });
  };

  const testConnection = async (provider, key) => {
    if (!key) {
      setTestResults({
        ...testResults,
        [provider]: { success: false, message: 'Please enter an API key' }
      });
      return;
    }

    setTesting({ ...testing, [provider]: true });

    try {
      await aiAPI.testConnection(provider, key);
      setTestResults({
        ...testResults,
        [provider]: { success: true, message: 'Connection successful!' }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        [provider]: { success: false, message: error.response?.data?.message || 'Connection failed' }
      });
    } finally {
      setTesting({ ...testing, [provider]: false });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      await authAPI.updateApiKeys(apiKeys);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-text">Settings</h1>
          <p className="text-primary-textSecondary mt-1">Manage your API keys and preferences</p>
        </div>

        <div className="bg-primary-panel rounded-lg border border-primary-border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-textSecondary mb-2">
              Preferred AI Provider
            </label>
            <select
              name="preferredProvider"
              value={apiKeys.preferredProvider}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-bg border border-primary-border rounded-lg text-primary-text focus:outline-none focus:border-primary-accent transition"
            >
              <option value="openrouter">OpenRouter</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          <div className="border-t border-primary-border pt-6">
            <h3 className="text-lg font-semibold text-primary-text mb-4">API Keys</h3>
            <p className="text-sm text-primary-textSecondary mb-6">
              Your API keys are encrypted and stored securely. They are used to make requests to AI providers on your behalf.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-textSecondary mb-2">
                  OpenRouter API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    name="openRouter"
                    value={apiKeys.openRouter}
                    onChange={handleChange}
                    placeholder="sk-or-..."
                    className="flex-1 px-4 py-3 bg-primary-bg border border-primary-border rounded-lg text-primary-text focus:outline-none focus:border-primary-accent transition"
                  />
                  <button
                    onClick={() => testConnection('openrouter', apiKeys.openRouter)}
                    disabled={testing.openRouter}
                    className="px-4 py-3 bg-primary-bg border border-primary-border hover:border-primary-accent text-primary-text rounded-lg transition disabled:opacity-50"
                  >
                    {testing.openRouter ? <Loader className="h-5 w-5 animate-spin" /> : 'Test'}
                  </button>
                </div>
                {testResults.openRouter && (
                  <div className={`flex items-center space-x-2 mt-2 text-sm ${testResults.openRouter.success ? 'text-green-500' : 'text-red-500'}`}>
                    {testResults.openRouter.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span>{testResults.openRouter.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-textSecondary mb-2">
                  OpenAI API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    name="openAI"
                    value={apiKeys.openAI}
                    onChange={handleChange}
                    placeholder="sk-..."
                    className="flex-1 px-4 py-3 bg-primary-bg border border-primary-border rounded-lg text-primary-text focus:outline-none focus:border-primary-accent transition"
                  />
                  <button
                    onClick={() => testConnection('openai', apiKeys.openAI)}
                    disabled={testing.openai}
                    className="px-4 py-3 bg-primary-bg border border-primary-border hover:border-primary-accent text-primary-text rounded-lg transition disabled:opacity-50"
                  >
                    {testing.openai ? <Loader className="h-5 w-5 animate-spin" /> : 'Test'}
                  </button>
                </div>
                {testResults.openAI && (
                  <div className={`flex items-center space-x-2 mt-2 text-sm ${testResults.openAI.success ? 'text-green-500' : 'text-red-500'}`}>
                    {testResults.openAI.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span>{testResults.openAI.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-textSecondary mb-2">
                  Anthropic API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    name="anthropic"
                    value={apiKeys.anthropic}
                    onChange={handleChange}
                    placeholder="sk-ant-..."
                    className="flex-1 px-4 py-3 bg-primary-bg border border-primary-border rounded-lg text-primary-text focus:outline-none focus:border-primary-accent transition"
                  />
                  <button
                    onClick={() => testConnection('anthropic', apiKeys.anthropic)}
                    disabled={testing.anthropic}
                    className="px-4 py-3 bg-primary-bg border border-primary-border hover:border-primary-accent text-primary-text rounded-lg transition disabled:opacity-50"
                  >
                    {testing.anthropic ? <Loader className="h-5 w-5 animate-spin" /> : 'Test'}
                  </button>
                </div>
                {testResults.anthropic && (
                  <div className={`flex items-center space-x-2 mt-2 text-sm ${testResults.anthropic.success ? 'text-green-500' : 'text-red-500'}`}>
                    {testResults.anthropic.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span>{testResults.anthropic.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-primary-border pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            {saveMessage && (
              <div className={`mt-4 p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-500 bg-opacity-10 text-green-500' : 'bg-red-500 bg-opacity-10 text-red-500'}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-500 bg-opacity-10 border border-blue-500 text-blue-400 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Getting API Keys</h4>
          <ul className="space-y-1 text-sm">
            <li>• OpenRouter: <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">https://openrouter.ai/keys</a></li>
            <li>• OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">https://platform.openai.com/api-keys</a></li>
            <li>• Anthropic: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">https://console.anthropic.com/settings/keys</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
