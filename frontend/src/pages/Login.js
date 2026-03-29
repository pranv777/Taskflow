// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INPUT_STYLE = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  background: '#1e293b', border: '1px solid #334155',
  color: '#f1f5f9', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none',
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);

  const set = (k) => (e) => { clearError(); setForm(f => ({ ...f, [k]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok } = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#020817', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: '2.5rem' }}>⚡</span>
          <h1 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.8rem', margin: '8px 0 4px', letterSpacing: '-0.03em' }}>
            TaskFlow
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Sign in to your workspace</p>
        </div>

        <div style={{
          background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16,
          padding: 32, boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{
              background: '#2d0a0a', border: '1px solid #dc2626', color: '#f87171',
              padding: '11px 14px', borderRadius: 8, marginBottom: 20, fontSize: '0.875rem',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input type="email" value={form.email} onChange={set('email')}
                style={INPUT_STYLE} placeholder="you@example.com" required />
            </div>

            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input type="password" value={form.password} onChange={set('password')}
                style={INPUT_STYLE} placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', marginTop: 4,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#64748b', marginTop: 24, fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div style={{
            marginTop: 20, padding: '12px 14px', borderRadius: 8,
            background: '#1e293b', border: '1px solid #334155', fontSize: '0.8rem',
          }}>
            <p style={{ color: '#64748b', margin: '0 0 4px', fontWeight: 600 }}>Demo Admin:</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>admin@taskflow.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
