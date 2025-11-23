import axios from 'axios';
import User from '../models/User.js';

// @desc    Chat with AI
// @route   POST /api/ai/chat
// @access  Private
export const chat = async (req, res) => {
  try {
    const { messages, provider } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    const user = await User.findById(req.user._id);
    const decryptedKeys = user.getDecryptedApiKeys();

    const selectedProvider = provider || user.preferredProvider;

    let response;

    switch (selectedProvider) {
      case 'openrouter':
        if (!decryptedKeys.openRouter) {
          return res.status(400).json({ message: 'OpenRouter API key not configured' });
        }
        response = await chatWithOpenRouter(decryptedKeys.openRouter, messages);
        break;

      case 'openai':
        if (!decryptedKeys.openAI) {
          return res.status(400).json({ message: 'OpenAI API key not configured' });
        }
        response = await chatWithOpenAI(decryptedKeys.openAI, messages);
        break;

      case 'anthropic':
        if (!decryptedKeys.anthropic) {
          return res.status(400).json({ message: 'Anthropic API key not configured' });
        }
        response = await chatWithAnthropic(decryptedKeys.anthropic, messages);
        break;

      default:
        return res.status(400).json({ message: 'Invalid AI provider' });
    }

    res.json(response);
  } catch (error) {
    console.error('AI Chat Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'AI service error',
      error: error.response?.data?.error?.message || error.message
    });
  }
};

// OpenRouter API
async function chatWithOpenRouter(apiKey, messages) {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL,
        'X-Title': 'AI Coder'
      }
    }
  );

  return {
    message: response.data.choices[0].message.content,
    usage: response.data.usage
  };
}

// OpenAI API
async function chatWithOpenAI(apiKey, messages) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    message: response.data.choices[0].message.content,
    usage: response.data.usage
  };
}

// Anthropic API
async function chatWithAnthropic(apiKey, messages) {
  // Convert messages format for Anthropic
  const anthropicMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content
  }));

  const systemMessage = messages.find(m => m.role === 'system')?.content ||
    'You are a helpful AI assistant that generates HTML, CSS, and JavaScript code.';

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: systemMessage,
      messages: anthropicMessages
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    message: response.data.content[0].text,
    usage: response.data.usage
  };
}

// @desc    Test API connection
// @route   POST /api/ai/test
// @access  Private
export const testConnection = async (req, res) => {
  try {
    const { provider, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: 'API key required' });
    }

    const testMessages = [
      { role: 'user', content: 'Say "Connection successful" if you can read this.' }
    ];

    let result;

    switch (provider) {
      case 'openrouter':
        result = await chatWithOpenRouter(apiKey, testMessages);
        break;
      case 'openai':
        result = await chatWithOpenAI(apiKey, testMessages);
        break;
      case 'anthropic':
        result = await chatWithAnthropic(apiKey, testMessages);
        break;
      default:
        return res.status(400).json({ message: 'Invalid provider' });
    }

    res.json({ success: true, message: 'Connection successful' });
  } catch (error) {
    console.error('Test Connection Error:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      message: 'Connection failed',
      error: error.response?.data?.error?.message || error.message
    });
  }
};
