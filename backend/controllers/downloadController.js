import archiver from 'archiver';
import Project from '../models/Project.js';

// @desc    Download project as ZIP
// @route   GET /api/download/:id
// @access  Private
export const downloadProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Set headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name}.zip"`);

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    // Add files to archive
    archive.append(project.htmlCode, { name: 'index.html' });
    archive.append(project.cssCode, { name: 'styles.css' });
    archive.append(project.jsCode, { name: 'script.js' });

    // Create a README
    const readme = `# ${project.name}

Created with AI Coder

## Files
- index.html - Main HTML file
- styles.css - CSS styles
- script.js - JavaScript code

## Usage
Open index.html in your browser to view the project.
`;

    archive.append(readme, { name: 'README.md' });

    await archive.finalize();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};
