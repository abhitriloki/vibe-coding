import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  apiKeys: {
    openRouter: {
      type: String,
      default: ''
    },
    openAI: {
      type: String,
      default: ''
    },
    anthropic: {
      type: String,
      default: ''
    }
  },
  preferredProvider: {
    type: String,
    enum: ['openrouter', 'openai', 'anthropic'],
    default: 'openrouter'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Encrypt API keys before saving
userSchema.pre('save', function(next) {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (this.isModified('apiKeys.openRouter') && this.apiKeys.openRouter) {
    this.apiKeys.openRouter = CryptoJS.AES.encrypt(
      this.apiKeys.openRouter,
      encryptionKey
    ).toString();
  }

  if (this.isModified('apiKeys.openAI') && this.apiKeys.openAI) {
    this.apiKeys.openAI = CryptoJS.AES.encrypt(
      this.apiKeys.openAI,
      encryptionKey
    ).toString();
  }

  if (this.isModified('apiKeys.anthropic') && this.apiKeys.anthropic) {
    this.apiKeys.anthropic = CryptoJS.AES.encrypt(
      this.apiKeys.anthropic,
      encryptionKey
    ).toString();
  }

  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Decrypt API keys method
userSchema.methods.getDecryptedApiKeys = function() {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const decrypted = {};

  if (this.apiKeys.openRouter) {
    try {
      const bytes = CryptoJS.AES.decrypt(this.apiKeys.openRouter, encryptionKey);
      decrypted.openRouter = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      decrypted.openRouter = '';
    }
  }

  if (this.apiKeys.openAI) {
    try {
      const bytes = CryptoJS.AES.decrypt(this.apiKeys.openAI, encryptionKey);
      decrypted.openAI = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      decrypted.openAI = '';
    }
  }

  if (this.apiKeys.anthropic) {
    try {
      const bytes = CryptoJS.AES.decrypt(this.apiKeys.anthropic, encryptionKey);
      decrypted.anthropic = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      decrypted.anthropic = '';
    }
  }

  return decrypted;
};

export default mongoose.model('User', userSchema);
