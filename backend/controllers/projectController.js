import Project from '../models/Project.js';
import crypto from 'crypto';

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ lastModified: -1 })
      .select('-chatHistory');

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { name, htmlCode, cssCode, jsCode } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a project name' });
    }

    const project = await Project.create({
      userId: req.user._id,
      name,
      htmlCode,
      cssCode,
      jsCode,
      chatHistory: []
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { name, htmlCode, cssCode, jsCode, chatHistory } = req.body;

    if (name !== undefined) project.name = name;
    if (htmlCode !== undefined) project.htmlCode = htmlCode;
    if (cssCode !== undefined) project.cssCode = cssCode;
    if (jsCode !== undefined) project.jsCode = jsCode;
    if (chatHistory !== undefined) project.chatHistory = chatHistory;

    await project.save();

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add message to chat history
// @route   POST /api/projects/:id/chat
// @access  Private
export const addChatMessage = async (req, res) => {
  try {
    const { role, content } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.chatHistory.push({ role, content });
    await project.save();

    res.json(project.chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate share link
// @route   POST /api/projects/:id/share
// @access  Private
export const shareProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.shareToken) {
      project.shareToken = crypto.randomBytes(16).toString('hex');
    }

    project.isPublic = true;
    await project.save();

    res.json({
      shareToken: project.shareToken,
      shareUrl: `${process.env.FRONTEND_URL}/share/${project.shareToken}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get shared project
// @route   GET /api/projects/shared/:token
// @access  Public
export const getSharedProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      shareToken: req.params.token,
      isPublic: true
    }).select('-userId -chatHistory');

    if (!project) {
      return res.status(404).json({ message: 'Shared project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
