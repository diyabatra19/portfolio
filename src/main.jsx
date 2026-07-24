import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Local QA hook for checking the reduced-motion experience without changing OS settings.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion')) {
  document.documentElement.classList.add('reduce-motion');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
