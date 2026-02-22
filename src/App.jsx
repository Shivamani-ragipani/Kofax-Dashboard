import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import ClientTable from './components/ClientTable';
import AiInsights from './components/AiInsights';
import './styles/app.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  // Initialize theme on app load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        document.documentElement.setAttribute('data-theme', stored);
      } else if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        // Default to light theme
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      // Fallback: set to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(id) => setActiveView(id)}
      />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="dashboard-content">
          {activeView === 'ai-insights' ? (
            <AiInsights />
          ) : (
            <>
              <KPICards />
              <ChartsSection />
              <ClientTable />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
