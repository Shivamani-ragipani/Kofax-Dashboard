import React, { useEffect, useState } from "react";
import "../styles/settings.css";

function Settings() {

  const getStoredTheme = () => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getStoredTheme());
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [username, setUsername] = useState("Vamshi Ragipani");
  const [email, setEmail] = useState("vamshi@example.com");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const saveSettings = () => {

    const settings = {
      theme,
      notifications,
      autoRefresh,
      username,
      email
    };

    localStorage.setItem("dashboardSettings", JSON.stringify(settings));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

  };

  useEffect(() => {

    const stored = localStorage.getItem("dashboardSettings");

    if (stored) {

      const s = JSON.parse(stored);

      setNotifications(s.notifications);
      setAutoRefresh(s.autoRefresh);
      setUsername(s.username);
      setEmail(s.email);

    }

  }, []);


  return (

    <div className="settings-page">


      <div className="settings-header">

        <h2>Settings</h2>

        <p>
          Manage application preferences and account configuration
        </p>

      </div>



      <div className="settings-grid">


        <div className="settings-card">

          <h3>Appearance</h3>


          <div className="setting-row">

            <span>Theme</span>

            <select
              value={theme}
              onChange={(e)=>setTheme(e.target.value)}
            >

              <option value="light">
                Light Mode
              </option>

              <option value="dark">
                Dark Mode
              </option>

            </select>

          </div>

        </div>



        <div className="settings-card">

          <h3>Preferences</h3>


          <div className="setting-row">

            <span>Notifications</span>

            <label className="switch">

              <input
                type="checkbox"
                checked={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
              />

              <span className="slider"/>

            </label>

          </div>



          <div className="setting-row">

            <span>Auto Refresh Data</span>

            <label className="switch">

              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={() =>
                  setAutoRefresh(!autoRefresh)
                }
              />

              <span className="slider"/>

            </label>

          </div>

        </div>



        <div className="settings-card">

          <h3>Profile</h3>


          <div className="form-group">

            <label>Name</label>

            <input
              value={username}
              onChange={(e)=>
                setUsername(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
            />

          </div>

        </div>


      </div>



      <div className="settings-footer">

        <button
          className="save-btn"
          onClick={saveSettings}
        >

          Save Settings

        </button>


        {saved && (

          <span className="saved-msg">
            Settings Saved ✓
          </span>

        )}

      </div>


    </div>

  );

}

export default Settings;