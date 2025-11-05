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

  // Efecto principal para verificar autenticación
  useEffect(() => {
    checkAuthState();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Evento de auth:", event);

      if (event === "SIGNED_IN" && session) {
        await handleUserAuthenticated(session.user);
      } else if (event === "SIGNED_OUT") {
        handleUserSignedOut();
      } else if (event === "INITIAL_SESSION" && session) {
        await handleUserAuthenticated(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log("🔄 Verificando estado de autenticación...");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Error obteniendo sesión:", error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log("✅ Usuario autenticado encontrado:", session.user.email);
        await handleUserAuthenticated(session.user);
      } else {
        console.log("ℹ️ No hay usuario autenticado");
        setUser(null);
        setUserProfile(null);
        setCurrentView("welcome");
      }
    } catch (error) {
      console.error("💥 Error en checkAuthState:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAuthenticated = async (userData) => {
    try {
      console.log("👤 Procesando usuario autenticado:", userData.email);

      const profile = await loadUserProfile(userData.email);
      setUser({
        email: userData.email,
        id: userData.id,
      });
      setUserProfile(profile);

      // Solo cambiar a dashboard si estamos en welcome/login/register
      if (["welcome", "login", "register"].includes(currentView)) {
        setCurrentView("dashboard");
      }

      await updateLastAccess(userData.email);

      console.log("✅ Autenticación completada");
    } catch (error) {
      console.error("❌ Error en handleUserAuthenticated:", error);
    }
  };

  const handleUserSignedOut = () => {
    console.log("👋 Usuario cerró sesión");
    setUser(null);
    setUserProfile(null);
    setCurrentView("welcome");
  };

  const loadUserProfile = async (email) => {
    try {
      console.log("📋 Cargando perfil para:", email);

      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.warn("⚠️ Usuario no encontrado en tabla, creando perfil...");
        return await createUserProfile(email);
      }

      console.log("✅ Perfil cargado:", data);
      return data;
    } catch (error) {
      console.error("❌ Error cargando perfil:", error);
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

      console.log("✅ Perfil creado:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creando perfil:", error);
      return null;
    }
  };

  const updateLastAccess = async (email) => {
    try {
      await supabase
        .from("usuarios")
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq("email", email);
    } catch (error) {
      console.error("❌ Error actualizando último acceso:", error);
    }
  };

  const handleLogin = async (email) => {
    console.log("🚀 Login manual para:", email);
    // La autenticación real se maneja en onAuthStateChange
  };

  const handleRegister = async (email) => {
    console.log("🎉 Registro manual para:", email);
    // La autenticación real se maneja en onAuthStateChange
  };

  const handleLogout = async () => {
    try {
      console.log("👋 Cerrando sesión...");

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // El estado se actualizará automáticamente por onAuthStateChange
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
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

  const navigateTo = (view) => {
    console.log("🧭 Navegando a:", view);
    setCurrentView(view);
  };

  // Loading component
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <i className="fas fa-spinner fa-spin"></i>
          <h3>Cargando aplicación...</h3>
          <p>Verificando autenticación</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    console.log("🎬 Renderizando vista:", currentView);
    console.log("👤 Estado usuario:", user ? "Autenticado" : "No autenticado");

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
            <button onClick={() => navigateTo("dashboard")}>
              Volver al Dashboard
            </button>
          </div>
        );

      default:
        console.warn("⚠️ Vista no reconocida, redirigiendo a welcome");
        return <Welcome onStart={handleStart} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <i className="fas fa-recycle"></i>
          <span>Estación de Clasificación</span>
        </div>

        {/* NAVEGACIÓN - Mostrar solo si hay usuario autenticado */}
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
          Sistema de Monitoreo - Tesis 2024 |
          {user
            ? ` Usuario: ${user.email} ${isAdmin() ? "(Admin)" : ""}`
            : " No autenticado"}
        </p>
      </footer>
    </div>
  );
}

export default App;
