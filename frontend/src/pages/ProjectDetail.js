import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, getTasksByProject, createTask, toggleTask, deleteTask, deleteProject } from '../services/api';

function ProjectDetail({ user, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [projectRes, tasksRes] = await Promise.all([
                getProject(id),
                getTasksByProject(id)
            ]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            setError('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask({ ...formData, projectId: parseInt(id) });
            setFormData({ title: '', description: '', dueDate: '' });
            setShowModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create task');
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            await toggleTask(taskId);
            fetchData();
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            try {
                await deleteTask(taskId);
                fetchData();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
            try {
                await deleteProject(id);
                navigate('/');
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    if (loading) {
        return (
            <div>
                <div className="bg-animated"></div>
                <div className="container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

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

                <Link to="/" className="back-link">← Back to Projects</Link>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
                    <div className="page-header" style={{ margin: 0 }}>
                        <div>
                            <h1 className="page-title">{project?.title}</h1>
                            <p className="page-subtitle">{project?.description || 'No description'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                + Add Task
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteProject}>
                                Delete Project
                            </button>
                        </div>
                    </div>

                    <div className="progress-container" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--gray)', fontSize: '14px' }}>
                                {completedCount} of {tasks.length} tasks completed
                            </span>
                            <span style={{ fontWeight: '600', color: 'var(--primary-light)' }}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="progress-bar" style={{ height: '12px' }}>
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Tasks</h2>

                {tasks.length === 0 ? (
                    <div className="empty-state card">
                        <div className="empty-icon">✅</div>
                        <h3 className="empty-title">No tasks yet</h3>
                        <p>Add your first task to get started</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setShowModal(true)}>
                            + Add Task
                        </button>
                    </div>
                ) : (
                    <div className="task-list">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-item">
                                <div
                                    className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                                    onClick={() => handleToggleTask(task.id)}
                                ></div>
                                <div className="task-content">
                                    <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                                        {task.title}
                                    </div>
                                    <div className="task-meta">
                                        {task.description && <span>{task.description}</span>}
                                        {task.dueDate && (
                                            <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="task-btn delete" onClick={() => handleDeleteTask(task.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Task Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="card modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add New Task</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleCreateTask}>
                                <div className="form-group">
                                    <label className="form-label">Task Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="What needs to be done?"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (optional)</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Add more details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Due Date (optional)</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Task
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

export default ProjectDetail;
