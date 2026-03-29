// src/api/services.js
import api from './client';

/* ── Auth ── */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

/* ── Tasks ── */
export const taskAPI = {
  getAll:   (params) => api.get('/tasks', { params }),
  getById:  (id)     => api.get(`/tasks/${id}`),
  create:   (data)   => api.post('/tasks', data),
  update:   (id, data) => api.put(`/tasks/${id}`, data),
  remove:   (id)     => api.delete(`/tasks/${id}`),
};

/* ── Admin ── */
export const adminAPI = {
  stats:        ()   => api.get('/admin/stats'),
  users:        ()   => api.get('/admin/users'),
  toggleUser:   (id) => api.patch(`/admin/users/${id}/toggle`),
};
