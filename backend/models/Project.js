import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  htmlCode: {
    type: String,
    default: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>'
  },
  cssCode: {
    type: String,
    default: '/* Add your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n'
  },
  jsCode: {
    type: String,
    default: '// Add your JavaScript here\nconsole.log("Hello World!");'
  },
  chatHistory: [messageSchema],
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified on save
projectSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Index for faster queries
projectSchema.index({ userId: 1, lastModified: -1 });

export default mongoose.model('Project', projectSchema);
