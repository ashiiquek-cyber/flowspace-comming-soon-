import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The static hero frame from index.html now lies hidden under the app's own; tidy it away once
// the page has settled (removing it at once would forfeit its paint as the page's LCP)
const shell = document.getElementById('hero-shell');
if (shell) window.setTimeout(() => shell.remove(), 5000);
