// src/components/TaskModal.js
import React, { useState, useEffect } from 'react';

const INPUT_STYLE = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: '#1e293b', border: '1px solid #334155',
  color: '#f1f5f9', fontSize: '0.9rem', boxSizing: 'border-box',
  outline: 'none',
};
const LABEL_STYLE = { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, display: 'block' };

const TaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title:       task?.title       || '',
    description: task?.description || '',
    status:      task?.status      || 'todo',
    priority:    task?.priority    || 'medium',
    due_date:    task?.due_date ? task.due_date.split('T')[0] : '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    const result = await onSave(form);
    setSaving(false);
    if (result?.error) setError(result.error);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: 16, padding: 32, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ color: '#f1f5f9', margin: '0 0 24px', fontWeight: 700 }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        {error && (
          <div style={{ background: '#2d0a0a', border: '1px solid #dc2626', color: '#f87171',
            padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Title *</label>
            <input value={form.title} onChange={set('title')} style={INPUT_STYLE} placeholder="What needs to be done?" />
          </div>

          <div>
            <label style={LABEL_STYLE}>Description</label>
            <textarea value={form.description} onChange={set('description')}
              style={{ ...INPUT_STYLE, minHeight: 90, resize: 'vertical' }}
              placeholder="Add more details..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL_STYLE}>Status</label>
              <select value={form.status} onChange={set('status')} style={INPUT_STYLE}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>Priority</label>
              <select value={form.priority} onChange={set('priority')} style={INPUT_STYLE}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label style={LABEL_STYLE}>Due Date</label>
            <input type="date" value={form.due_date} onChange={set('due_date')} style={INPUT_STYLE} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontWeight: 600,
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              flex: 1, padding: '11px', borderRadius: 8, cursor: 'pointer',
              background: '#6366f1', border: 'none', color: '#fff', fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}>{saving ? 'Saving…' : (task ? 'Update Task' : 'Create Task')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
