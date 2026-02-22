import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/app.css';
import './styles/header.css';
import './styles/sidebar.css';
import './styles/kpi-cards.css';
import './styles/charts.css';
import './styles/client-table.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
