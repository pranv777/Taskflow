// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global reset
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #020817; }
  input, select, textarea, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
