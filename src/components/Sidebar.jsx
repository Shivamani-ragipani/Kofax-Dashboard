import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Grid2x2,
  BarChart3,
  Users,
  Settings,
  Menu
} from 'lucide-react';
import '../styles/sidebar.css';

function Sidebar({ isOpen, onToggleSidebar, onNavigate }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kofax', label: 'Kofax Clients', icon: Database },
    { id: 'tta', label: 'TTA Clients', icon: Grid2x2 },
    { id: 'analytics', label: 'Feature Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: Users },
    { id: 'ai-insights', label: 'AI Insights', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      <div className="sidebar-header">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map(item => (
            <li key={item.id} className="menu-item">
              <a
                href={`/${item.id}`}
                className={`menu-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.id);
                  if (onNavigate) onNavigate(item.id);
                }}
              >
                <item.icon size={20} />
                <span className="menu-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 👇 PROFILE SECTION */}
      <div className="sidebar-footer profile-section">
        <div className="profile-container">
          <img
            src="/my-avatar.png"
            alt="Vamshi Ragipani"
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">Vamshi Ragipani</span>
            <span className="profile-role">SDE</span>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;