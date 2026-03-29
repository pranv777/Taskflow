// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Toast from '../components/Toast';

const BTN = {
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  border: 'none', color: '#fff', padding: '10px 20px',
  borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks,      setTasks]      = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);   // null | 'create' | task-object
  const [toast,      setToast]      = useState(null);
  const [filters,    setFilters]    = useState({ status: '', priority: '', search: '', page: 1 });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: 9 };
      if (filters.status)   params.status   = filters.status;
      if (filters.priority) params.priority  = filters.priority;
      if (filters.search)   params.search    = filters.search;
      const { data } = await taskAPI.getAll(params);
      setTasks(data.data.tasks);
      setPagination(data.data.pagination);
    } catch { showToast('Failed to load tasks', 'error'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (form) => {
    try {
      if (modal?.id) {
        await taskAPI.update(modal.id, form);
        showToast('Task updated!');
      } else {
        await taskAPI.create(form);
        showToast('Task created!');
      }
      setModal(null);
      fetchTasks();
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to save task' };
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.remove(id);
      showToast('Task deleted');
      fetchTasks();
    } catch { showToast('Failed to delete task', 'error'); }
  };

  const FILTER_SELECT = (key, options, placeholder) => (
    <select value={filters[key]}
      onChange={e => setFilters(f => ({ ...f, [key]: e.target.value, page: 1 }))}
      style={{
        background: '#1e293b', border: '1px solid #334155', color: '#94a3b8',
        padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer',
      }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  // Stats
  const stats = {
    total:      tasks.length,
    todo:       tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done:       tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020817' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.6rem', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              My Tasks
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
              Welcome back, {user?.name}
            </p>
          </div>
          <button style={BTN} onClick={() => setModal('create')}>+ New Task</button>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total',       value: pagination.total || 0, color: '#6366f1' },
            { label: 'To Do',       value: stats.todo,            color: '#475569' },
            { label: 'In Progress', value: stats.inProgress,      color: '#3b82f6' },
            { label: 'Done',        value: stats.done,            color: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12,
              padding: '16px 20px',
            }}>
              <p style={{ color: '#64748b', margin: '0 0 4px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ color: s.color, margin: 0, fontWeight: 800, fontSize: '1.6rem' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            placeholder="Search tasks…"
            style={{
              background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9',
              padding: '8px 14px', borderRadius: 8, fontSize: '0.875rem', outline: 'none',
              minWidth: 200,
            }} />
          {FILTER_SELECT('status', [
            { v: 'todo', l: 'To Do' },
            { v: 'in_progress', l: 'In Progress' },
            { v: 'done', l: 'Done' },
          ], 'All Statuses')}
          {FILTER_SELECT('priority', [
            { v: 'low', l: 'Low' },
            { v: 'medium', l: 'Medium' },
            { v: 'high', l: 'High' },
          ], 'All Priorities')}
          {(filters.status || filters.priority || filters.search) && (
            <button onClick={() => setFilters({ status: '', priority: '', search: '', page: 1 })}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
              Clear
            </button>
          )}
        </div>

        {/* Task grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>📭</p>
            <p style={{ color: '#64748b', marginTop: 12 }}>No tasks yet. Create your first one!</p>
            <button style={{ ...BTN, marginTop: 16 }} onClick={() => setModal('create')}>+ New Task</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} onEdit={setModal} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                style={{
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                  background: filters.page === p ? '#6366f1' : '#1e293b',
                  border: `1px solid ${filters.page === p ? '#6366f1' : '#334155'}`,
                  color: filters.page === p ? '#fff' : '#94a3b8',
                  fontWeight: filters.page === p ? 700 : 400,
                }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal === 'create' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Dashboard;
