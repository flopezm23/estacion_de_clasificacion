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
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    checkUser();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await handleUserSession(session.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setCurrentView("welcome");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await handleUserSession(session.user);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSession = async (userData) => {
    const profile = await loadUserProfile(userData.email);
    setUser({ email: userData.email });
    setUserProfile(profile);
    setCurrentView("dashboard");

    // Actualizar último acceso
    await updateLastAccess(userData.email);
  };

  // Función para cargar el perfil del usuario desde la tabla usuarios
  const loadUserProfile = async (email) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.warn("Error loading user profile:", error);
        // Crear perfil básico si no existe
        return await createUserProfile(email);
      }
      return data;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  };

  const createUserProfile = async (email) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .insert([
          {
            email: email,
            nombre: email.split("@")[0],
            tipo_usuario: "usuario",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating user profile:", error);
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
    // La autenticación ya se maneja en onAuthStateChange
    setCurrentView("dashboard");
  };

  const handleRegister = async (email) => {
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
      setCurrentView("welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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

  // Función para navegación entre páginas
  const navigateTo = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

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
        return <Dashboard onNavigate={navigateTo} />;

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
        return <Dashboard onNavigate={navigateTo} />;
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
              onClick={() => navigateTo("dashboard")}
            >
              <i className="fas fa-chart-bar"></i> Reportes
            </button>
            <button
              className={currentView === "powerbi" ? "active" : ""}
              onClick={() => navigateTo("powerbi")}
            >
              <i className="fas fa-chart-line"></i> Power BI
            </button>
            <button
              className={currentView === "data" ? "active" : ""}
              onClick={() => navigateTo("data")}
            >
              <i className="fas fa-database"></i> Datos
            </button>
            <button
              className={currentView === "reciclaje" ? "active" : ""}
              onClick={() => navigateTo("reciclaje")}
            >
              <i className="fas fa-recycle"></i> Reciclaje
            </button>
            <button
              className={currentView === "estacion" ? "active" : ""}
              onClick={() => navigateTo("estacion")}
            >
              <i className="fas fa-robot"></i> Estación
            </button>

            {/* Botón de Admin - solo para administradores */}
            {isAdmin() && (
              <button
                className={currentView === "admin" ? "active" : ""}
                onClick={() => navigateTo("admin")}
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
