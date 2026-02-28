import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  Users,
  Settings,
  Menu,
  Layers,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import { NavLink, useLocation } from "react-router-dom";

import '../styles/sidebar.css';

function Sidebar({ isOpen, onToggleSidebar, onLogout }) {

  const location = useLocation();

  const [showLogout, setShowLogout] = useState(false);

  const [showDashboardMenu, setShowDashboardMenu] =
    useState(false);


  /* Auto open Dashboard menu when inside */

  useEffect(() => {

    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/clients-info"
    ) {

      setShowDashboardMenu(true);

    }

  }, [location.pathname]);


  const menuItems = [

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
        >

          <Menu size={18} />

        </button>

      </div>



      <nav className="sidebar-nav">

        <ul className="menu-list">


          {/* DASHBOARD TOGGLE */}

          <li className="menu-item">

            <div
              className="menu-link"
              onClick={() =>
                setShowDashboardMenu(
                  !showDashboardMenu
                )
              }
            >

              <LayoutDashboard size={20} />

              <span className="menu-label">
                Dashboard
              </span>

              {isOpen && (

                showDashboardMenu ?

                  <ChevronDown
                    size={16}
                    style={{ marginLeft: "auto" }}
                  />

                  :

                  <ChevronRight
                    size={16}
                    style={{ marginLeft: "auto" }}
                  />

              )}

            </div>

          </li>



          {/* DASHBOARD SUBMENU */}

          {showDashboardMenu && (

            <>

              <li className="menu-item">

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ?
                      "menu-link active"
                      :
                      "menu-link"
                  }
                  style={{ paddingLeft: "38px" }}
                >

                  <LayoutDashboard size={18} />

                  <span className="menu-label">
                    Overview
                  </span>

                </NavLink>

              </li>



              <li className="menu-item">

                <NavLink
                  to="/clients-info"
                  className={({ isActive }) =>
                    isActive ?
                      "menu-link active"
                      :
                      "menu-link"
                  }
                  style={{ paddingLeft: "38px" }}
                >

                  <Database size={18} />

                  <span className="menu-label">
                    Clients Info
                  </span>

                </NavLink>

              </li>

            </>

          )}



          {/* OTHER MENUS */}

          {menuItems.map(item => (

            <li key={item.id} className="menu-item">

              <NavLink
                to={`/${item.id}`}
                className={({ isActive }) =>
                  isActive ?
                    "menu-link active"
                    :
                    "menu-link"
                }
              >

                <item.icon size={20} />

                <span className="menu-label">
                  {item.label}
                </span>

              </NavLink>

            </li>

          ))}



        </ul>

      </nav>



      <div className="sidebar-footer profile-section">



        <div
          className="profile-container"
          onClick={() =>
            setShowLogout(!showLogout)
          }
        >

          <img
            src="/my-avatar.png"
            alt="Vamshi Ragipani"
            className="profile-avatar"
          />

          <div className="profile-info">

            <span className="profile-name">
              Vamshi Ragipani
            </span>

            <span className="profile-role">
              SDE
            </span>

          </div>

        </div>



        {showLogout && (

          <button
            className="logout-btn"
            onClick={onLogout}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        )}



      </div>



    </aside>

  );

}

export default Sidebar;