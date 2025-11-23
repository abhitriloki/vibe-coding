import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import { Plus, Trash2, Clock, Code2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const response = await projectAPI.createProject({
        name: `New Project ${projects.length + 1}`
      });
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeleting(id);
    try {
      await projectAPI.deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-text">My Projects</h1>
            <p className="text-primary-textSecondary mt-1">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
          <button
            onClick={createNewProject}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-primary-panel rounded-lg border border-primary-border">
            <Code2 className="h-16 w-16 text-primary-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-medium text-primary-text mb-2">No projects yet</h3>
            <p className="text-primary-textSecondary mb-6">
              Create your first project and start building with AI
            </p>
            <button
              onClick={createNewProject}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-accent hover:bg-blue-600 text-white rounded-lg transition"
            >
              <Plus className="h-5 w-5" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-primary-panel border border-primary-border rounded-lg overflow-hidden hover:border-primary-accent transition cursor-pointer"
                onClick={() => navigate(`/editor/${project._id}`)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-primary-text mb-2 truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center text-sm text-primary-textSecondary mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(project.lastModified)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-primary-textSecondary">
                      Click to edit
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project._id);
                      }}
                      disabled={deleting === project._id}
                      className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
