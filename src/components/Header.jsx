import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, Settings } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../styles/header.css';

export default function Header({ onToggleSidebar }) {

  const navigate = useNavigate();

  const getInitialTheme = () => {

    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {}

    const attr =
      document.documentElement.getAttribute('data-theme');

    return attr === 'dark' ? 'dark' : 'light';
  };


  const [theme, setTheme] =
    useState(getInitialTheme);


  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    try {
      localStorage.setItem('theme', theme);
    } catch {}

  }, [theme]);


  const toggleTheme = () =>

    setTheme(prev =>
      prev === 'dark' ? 'light' : 'dark'
    );


  return (

    <header className="header">


      {/* LEFT */}

      <div className="header-left">

        <button
          className="menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <h1>Dashboard</h1>

      </div>



      {/* CENTER LINKS */}

      <div className="header-links">

        <a
          href="https://itsm.yourcompany.com"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          ITSM
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          YouTube
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          Facebook
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          Instagram
        </a>

      </div>



      {/* RIGHT */}

      <div className="header-right">


        <div className="search-bar">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>



        <div className="header-icons">


          <button
            className="icon-btn notification-btn"
            aria-label="Notifications"
          >

            <Bell size={20} />

            <span className="notification-badge">

              1

            </span>

          </button>



          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >

            {theme === 'dark'
              ? <Sun size={20} />
              : <Moon size={20} />
            }

          </button>



          <button
            className="icon-btn"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >

            <Settings size={20} />

          </button>


        </div>


      </div>


    </header>

  );

}