import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import KPICards from "./components/KPICards";
import ChartsSection from "./components/ChartsSection";
import ClientTable from "./components/ClientTable";

import AiInsights from "./components/AiInsights";
import Architecture from "./components/Architecture";
import ClientsInfo from "./components/ClientsInfo";
import Settings from "./components/Settings";

import Login from "./components/Login";

import "./styles/app.css";


/* ================================
Dashboard Page
================================ */

function DashboardPage() {

  return (

    <>
      <KPICards />
      <ChartsSection />
      <ClientTable />
    </>

  );

}


/* ================================
Protected Layout
================================ */

function ProtectedLayout({
  children,
  onLogout,
  sidebarOpen,
  setSidebarOpen
}) {

  return (

    <div className="app-container">

      <Sidebar
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={onLogout}
      />

      <div className="main-content">

        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="dashboard-content">

          {children}

        </div>

      </div>

    </div>

  );

}


/* ================================
Main App
================================ */

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);



  /* Theme Load */

  useEffect(() => {

    try {

      const storedTheme =
        localStorage.getItem("theme");

      if (storedTheme === "dark" || storedTheme === "light") {

        document.documentElement.setAttribute(
          "data-theme",
          storedTheme
        );

      } else {

        document.documentElement.setAttribute(
          "data-theme",
          "light"
        );

      }

    } catch {

      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );

    }

  }, []);



  /* Login */

  if (!isLoggedIn) {

    return (
      <Login onLogin={() => setIsLoggedIn(true)} />
    );

  }



  return (

    <BrowserRouter>

      <Routes>


        {/* Default Route */}

        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={

            <ProtectedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={() => setIsLoggedIn(false)}
            >

              <DashboardPage />

            </ProtectedLayout>

          }
        />


        {/* Clients Info */}

        <Route
          path="/clients-info"
          element={

            <ProtectedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={() => setIsLoggedIn(false)}
            >

              <ClientsInfo />

            </ProtectedLayout>

          }
        />


        {/* AI Insights */}

        <Route
          path="/ai-insights"
          element={

            <ProtectedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={() => setIsLoggedIn(false)}
            >

              <AiInsights />

            </ProtectedLayout>

          }
        />


        {/* Architecture */}

        <Route
          path="/architecture"
          element={

            <ProtectedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={() => setIsLoggedIn(false)}
            >

              <Architecture />

            </ProtectedLayout>

          }
        />


        {/* Settings */}

        <Route
          path="/settings"
          element={

            <ProtectedLayout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={() => setIsLoggedIn(false)}
            >

              <Settings />

            </ProtectedLayout>

          }
        />


        {/* Fallback */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" />}
        />


      </Routes>

    </BrowserRouter>

  );

}

export default App;