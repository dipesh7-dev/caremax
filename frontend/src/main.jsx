import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Ant Design baseline CSS reset
import 'antd/dist/reset.css';
// Global Tailwind styles and overrides
import './index.css';

// Create a root and render the application.  Vite uses modern
// module syntax so we import from ./App.jsx directly.  Wrapping
// BrowserRouter here ensures routing works across the entire app.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
