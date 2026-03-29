// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        color: location.pathname === to ? '#6366f1' : '#94a3b8',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '0.9rem',
        padding: '6px 12px',
        borderRadius: 6,
        background: location.pathname === to ? '#6366f120' : 'transparent',
        transition: 'all 0.2s',
      }}
    >{label}</Link>
  );

  return (
    <nav style={{
      background: '#0f172a',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          TaskFlow
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {navLink('/dashboard', 'My Tasks')}
        {isAdmin && navLink('/admin', 'Admin')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
          {user?.name} · <span style={{
            color: isAdmin ? '#f59e0b' : '#6366f1',
            textTransform: 'capitalize',
            fontWeight: 600,
          }}>{user?.role}</span>
        </span>
        <button onClick={handleLogout} style={{
          background: 'transparent',
          border: '1px solid #334155',
          color: '#94a3b8',
          padding: '5px 12px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: '0.85rem',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#334155'; e.target.style.color = '#94a3b8'; }}
        >Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
