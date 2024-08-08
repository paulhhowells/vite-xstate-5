import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log(
	'%c 🚀 ' + APP_NAME + ': ' + APP_VERSION,
	'font-size: 1rem; color: #22C; background-color: #FFF; padding: 0.5rem 2rem 0.5rem 0.25rem;'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
