import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../services/api';

function Projects({ user, onLogout }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(formData);
            setFormData({ title: '', description: '' });
            setShowModal(false);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                fetchProjects();
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    return (
        <div>
            <div className="bg-animated"></div>
            <div className="container">
                <header className="header">
                    <div className="logo">📋 Task Manager</div>
                    <div className="user-info">
                        <span className="user-name">Hello, {user?.name}</span>
                        <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Projects</h1>
                        <p className="page-subtitle">Manage your projects and tasks</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + New Project
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="empty-state">
                        <p>Loading...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3 className="empty-title">No projects yet</h3>
                        <p>Create your first project to get started</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setShowModal(true)}>
                            + Create Project
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <div key={project.id} className="card project-card">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description || 'No description'}</p>

                                <div className="project-stats">
                                    <span className="project-stat">📋 {project.totalTasks} tasks</span>
                                    <span className="project-stat">✅ {project.completedTasks} completed</span>
                                </div>

                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${project.progressPercentage || 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-text">
                                        <span>Progress</span>
                                        <span>{Math.round(project.progressPercentage || 0)}%</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                                        View Details
                                    </Link>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="card modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Create New Project</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="form-group">
                                    <label className="form-label">Project Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="My Awesome Project"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (optional)</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="What's this project about?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;
