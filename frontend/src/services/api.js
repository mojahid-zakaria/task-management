import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = (email, password) =>
    api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
    api.post('/auth/register', { name, email, password });

// Projects
export const getProjects = () =>
    api.get('/projects/');

export const getProject = (id) =>
    api.get(`/projects/${id}`);

export const createProject = (data) =>
    api.post('/projects/', data);

export const updateProject = (id, data) =>
    api.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

export const getProjectProgress = (id) =>
    api.get(`/projects/${id}/progress`);

// Tasks
export const getTasksByProject = (projectId) =>
    api.get(`/tasks/project/${projectId}`);

export const createTask = (data) =>
    api.post('/tasks/', data);

export const updateTask = (id, data) =>
    api.put(`/tasks/${id}`, data);

export const toggleTask = (id) =>
    api.patch(`/tasks/${id}/toggle`);

export const deleteTask = (id) =>
    api.delete(`/tasks/${id}`);

export default api;
