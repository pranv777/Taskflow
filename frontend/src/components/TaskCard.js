// src/components/TaskCard.js
import React from 'react';

const STATUS_COLORS = {
  todo:        { bg: '#1e293b', text: '#94a3b8', dot: '#475569' },
  in_progress: { bg: '#1c2e4a', text: '#60a5fa', dot: '#3b82f6' },
  done:        { bg: '#052e16', text: '#4ade80', dot: '#16a34a' },
};
const PRIORITY_COLORS = {
  low:    '#4ade80',
  medium: '#f59e0b',
  high:   '#ef4444',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const sc = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
  const pc = PRIORITY_COLORS[task.priority] || '#94a3b8';

  const statusLabel = task.status.replace('_', ' ');
  const dueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12,
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#334155'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ color: '#f1f5f9', margin: 0, fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4 }}>
          {task.title}
        </h3>
        <span style={{
          background: sc.bg, color: sc.text, fontSize: '0.72rem', fontWeight: 600,
          padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', textTransform: 'capitalize',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
          {statusLabel}
        </span>
      </div>

      {task.description && (
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
          {task.description.length > 100 ? task.description.slice(0, 100) + '…' : task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: pc, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ● {task.priority}
          </span>
          {dueDate && (
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>Due: {dueDate}</span>
          )}
          {task.user_name && (
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>· {task.user_name}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onEdit(task)} style={{
            background: 'transparent', border: '1px solid #334155', color: '#94a3b8',
            padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem',
          }}>Edit</button>
          <button onClick={() => onDelete(task.id)} style={{
            background: 'transparent', border: '1px solid #334155', color: '#ef4444',
            padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
