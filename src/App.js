import React, { useState, useEffect } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import DataTable from "./components/DataTable";
import PowerBIDashboard from "./components/PowerBIDashboard";
import ReciclajeInfo from "./components/ReciclajeInfo";
import EstacionClasificadora from "./components/EstacionClasificadora";
import AdminUsuarios from "./components/AdminUsuarios";
import { supabase } from "./config/supabase";

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Función para cargar el perfil del usuario desde la tabla usuarios
  const loadUserProfile = async (email) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  };

  // Función para actualizar último acceso
  const updateLastAccess = async (email) => {
    try {
      await supabase
        .from("usuarios")
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq("email", email);
    } catch (error) {
      console.error("Error updating last access:", error);
    }
  };

  const handleLogin = async (email) => {
    const profile = await loadUserProfile(email);
    setUser({ email });
    setUserProfile(profile);

    // Actualizar último acceso
    await updateLastAccess(email);

    setCurrentView("dashboard");
  };

  const handleRegister = async (email) => {
    const profile = await loadUserProfile(email);
    setUser({ email });
    setUserProfile(profile);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setUserProfile(null);
    setCurrentView("welcome");
  };

  const handleStart = () => {
    setCurrentView("login");
  };

  const handleBackToWelcome = () => {
    setCurrentView("welcome");
  };

  const isAdmin = () => {
    return (
      userProfile?.tipo_usuario === "admin" || user?.email === "admin@tesis.com"
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "welcome":
        return <Welcome onStart={handleStart} />;

      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setIsRegistering(true);
              setCurrentView("register");
            }}
            onBackToWelcome={handleBackToWelcome}
          />
        );

      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => {
              setIsRegistering(false);
              setCurrentView("login");
            }}
            onBackToWelcome={handleBackToWelcome}
          />
        );

      case "dashboard":
        return <Dashboard />;

      case "powerbi":
        return <PowerBIDashboard />;

      case "data":
        return <DataTable />;

      case "reciclaje":
        return <ReciclajeInfo />;

      case "estacion":
        return <EstacionClasificadora />;

      case "admin":
        return isAdmin() ? (
          <AdminUsuarios />
        ) : (
          <div className="access-denied">
            <i className="fas fa-ban"></i>
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos de administrador.</p>
            <button onClick={() => setCurrentView("dashboard")}>
              Volver al Dashboard
            </button>
          </div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <i className="fas fa-recycle"></i>
          <span>Estación de Clasificación</span>
        </div>
        {user && (
          <nav>
            <button
              className={currentView === "dashboard" ? "active" : ""}
              onClick={() => setCurrentView("dashboard")}
            >
              <i className="fas fa-chart-bar"></i> Reportes
            </button>
            <button
              className={currentView === "powerbi" ? "active" : ""}
              onClick={() => setCurrentView("powerbi")}
            >
              <i className="fas fa-chart-line"></i> Power BI
            </button>
            <button
              className={currentView === "data" ? "active" : ""}
              onClick={() => setCurrentView("data")}
            >
              <i className="fas fa-database"></i> Datos
            </button>
            <button
              className={currentView === "reciclaje" ? "active" : ""}
              onClick={() => setCurrentView("reciclaje")}
            >
              <i className="fas fa-recycle"></i> Reciclaje
            </button>
            <button
              className={currentView === "estacion" ? "active" : ""}
              onClick={() => setCurrentView("estacion")}
            >
              <i className="fas fa-robot"></i> Estación
            </button>

            {/* Botón de Admin - solo para administradores */}
            {isAdmin() && (
              <button
                className={currentView === "admin" ? "active" : ""}
                onClick={() => setCurrentView("admin")}
              >
                <i className="fas fa-users-cog"></i> Admin
              </button>
            )}

            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </nav>
        )}
      </header>

      <div className="content">{renderContent()}</div>

      <footer>
        <p>
          Sistema de Monitoreo - Tesis 2024 |{" "}
          {user
            ? `Usuario: ${user.email} ${isAdmin() ? "(Admin)" : ""}`
            : "No autenticado"}
        </p>
      </footer>
    </div>
  );
}

export default App;
