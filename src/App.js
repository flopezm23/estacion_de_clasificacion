import React, { useState } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // 📊 Reportes generales
import DataTable from "./components/DataTable"; // 📋 Tabla de datos
import PowerBIDashboard from "./components/PowerBIDashboard"; // 🚀 Nueva página separada

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    setUser({ email });
    setCurrentView("dashboard"); // Por defecto va a Reportes
  };

  const handleRegister = (email) => {
    setUser({ email });
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("welcome");
  };

  const handleStart = () => {
    setCurrentView("login");
  };

  const handleBackToWelcome = () => {
    setCurrentView("welcome");
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
        return <Dashboard />; // 📊 Reportes generales

      case "powerbi":
        return <PowerBIDashboard />; // 🚀 Página exclusiva de Power BI

      case "data":
        return <DataTable />; // 📋 Tabla de datos

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
          {user ? `Usuario: ${user.email}` : "No autenticado"}
        </p>
      </footer>
    </div>
  );
}

export default App;
