// src/components/Toast.js
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: '#052e16', border: '#16a34a', text: '#4ade80' },
    error:   { bg: '#2d0a0a', border: '#dc2626', text: '#f87171' },
    info:    { bg: '#0c1a3a', border: '#3b82f6', text: '#60a5fa' },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '12px 20px', borderRadius: 10,
      fontSize: '0.9rem', fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      maxWidth: 340,
      animation: 'slideIn 0.3s ease',
    }}>
      {message}
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </div>
  );
};

export default Toast;
