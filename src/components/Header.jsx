import React, { useEffect, useRef, useState } from "react";
import { Menu, Search, Bell, Moon, Sun, Settings } from "lucide-react";
import SettingsModal from "./Settings";
import "../styles/header.css";
import "../styles/settings.css";

export default function Header({ onToggleSidebar }) {

  const settingsRef = useRef(null);

  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    } catch {}

    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "dark" ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (
    <header className="header">

      <div className="header-left">
        <button
          className="menu-btn"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>

        <h1>Dashboard</h1>
      </div>


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


      <div className="header-right">

        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>


        <div className="header-icons">

          <button className="icon-btn notification-btn">
            <Bell size={20} />
            <span className="notification-badge">1</span>
          </button>


          <button
            className="icon-btn"
            onClick={toggleTheme}
          >
            {theme === "dark"
              ? <Sun size={20} />
              : <Moon size={20} />}
          </button>


          <div
            className="settings-wrapper"
            ref={settingsRef}
          >

            <button
              className="icon-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={20} />
            </button>


            {showSettings && (

              <div className="settings-dropdown">

                <SettingsModal
                  onClose={() => setShowSettings(false)}
                />

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
}