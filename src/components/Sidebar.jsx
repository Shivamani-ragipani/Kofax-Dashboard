import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Grid2x2,
  BarChart3,
  Users,
  Settings,
  Menu,
  Layers,
  LogOut
} from 'lucide-react';
import '../styles/sidebar.css';

function Sidebar({ isOpen, onToggleSidebar, onNavigate, onLogout }) {

  const [activeItem, setActiveItem] = useState('dashboard');
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kofax', label: 'Kofax Clients', icon: Database },
    { id: 'tta', label: 'TTA Clients', icon: Grid2x2 },
    { id: 'analytics', label: 'Feature Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: Users },
    { id: 'ai-insights', label: 'AI Insights', icon: Users },
    { id: 'architecture', label: 'Architecture', icon: Layers },
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


      <div className="sidebar-footer profile-section">

        <div
          className="profile-container"
          onClick={() => setShowLogout(!showLogout)}
        >
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


        {showLogout && (
          <button
            className="logout-btn"
            onClick={() => onLogout()}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}

      </div>

    </aside>
  );
}

export default Sidebar;