import React, { useState } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import DataTable from "./components/DataTable";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    setUser({ email });
    setCurrentView("dashboard");
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
            onSwitchToRegister={() => setIsRegistering(true)}
            onBackToWelcome={handleBackToWelcome}
          />
        );

      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsRegistering(false)}
            onBackToWelcome={handleBackToWelcome}
          />
        );

      case "dashboard":
        return <Dashboard />;

      case "data":
        return <DataTable />;

      default:
        return <Welcome onStart={handleStart} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <i className="fas fa-recycle"></i>
          <span>Estación clasificatoria</span>
        </div>
        {user && (
          <nav>
            <button
              className={currentView === "dashboard" ? "active" : ""}
              onClick={() => setCurrentView("dashboard")}
            >
              <i className="fas fa-chart-bar"></i> Dashboard
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
          Estación clasificatoria - 2025 |{" "}
          {user ? `Usuario: ${user.email}` : "No autenticado"}
        </p>
      </footer>
    </div>
  );
}

export default App;
