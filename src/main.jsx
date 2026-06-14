import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AnalyticsManager from './components/AnalyticsManager.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalyticsManager />
      <App />
      <ConsentBanner />
    </BrowserRouter>
  </React.StrictMode>,
);
