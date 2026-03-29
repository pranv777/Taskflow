// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/services';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const AdminPanel = () => {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    (async () => {
      try {
        const [s, u] = await Promise.all([adminAPI.stats(), adminAPI.users()]);
        setStats(s.data.data);
        setUsers(u.data.data);
      } catch { showToast('Failed to load admin data', 'error'); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id);
      showToast(data.message);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: data.data.is_active } : u));
    } catch { showToast('Failed to update user', 'error'); }
  };

  const STAT_CARD = (label, value, color) => (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 24px' }}>
      <p style={{ color: '#64748b', margin: '0 0 4px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ color, margin: 0, fontWeight: 800, fontSize: '2rem' }}>{value ?? '—'}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#020817' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.6rem', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 32px', fontSize: '0.9rem' }}>Platform overview and user management</p>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 36 }}>
            {STAT_CARD('Total Users',    stats.totalUsers,  '#6366f1')}
            {STAT_CARD('Total Tasks',    stats.totalTasks,  '#94a3b8')}
            {STAT_CARD('In Progress',    stats.activeTasks, '#3b82f6')}
            {STAT_CARD('Completed',      stats.doneTasks,   '#16a34a')}
          </div>
        )}

        {/* Users table */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e293b' }}>
            <h2 style={{ color: '#f1f5f9', margin: 0, fontWeight: 700, fontSize: '1rem' }}>All Users</h2>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading users…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1e293b' }}>
                  {['#', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                    <th key={h} style={{ color: '#64748b', fontWeight: 600, fontSize: '0.78rem',
                      textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px', textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b30'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ color: '#475569', padding: '14px 16px', fontSize: '0.85rem' }}>{i + 1}</td>
                    <td style={{ color: '#f1f5f9', padding: '14px 16px', fontWeight: 500, fontSize: '0.9rem' }}>{u.name}</td>
                    <td style={{ color: '#94a3b8', padding: '14px 16px', fontSize: '0.875rem' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        color: u.role === 'admin' ? '#f59e0b' : '#6366f1',
                        background: u.role === 'admin' ? '#f59e0b20' : '#6366f120',
                        padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize',
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        color: u.is_active ? '#4ade80' : '#ef4444',
                        background: u.is_active ? '#052e16' : '#2d0a0a',
                        padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                      }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ color: '#64748b', padding: '14px 16px', fontSize: '0.82rem' }}>
                      {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleUser(u.id)} style={{
                          background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                          border: `1px solid ${u.is_active ? '#dc2626' : '#16a34a'}`,
                          color: u.is_active ? '#ef4444' : '#4ade80',
                          padding: '4px 12px', borderRadius: 6,
                        }}>
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminPanel;
