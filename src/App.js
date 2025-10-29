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
    const checkUserWithTimeout = async () => {
      // Timeout de 5 segundos como máximo
      const timeoutId = setTimeout(() => {
        console.log("⏰ Timeout alcanzado, forzando fin de loading");
        setLoading(false);
        setCurrentView("welcome");
      }, 5000);

      await checkUser();

      // Limpiar timeout si checkUser termina antes
      clearTimeout(timeoutId);
    };

    checkUserWithTimeout();
  }, []);

  const checkUser = async () => {
    try {
      console.log("🔄 Verificando sesión de usuario...");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Error obteniendo sesión:", error);
        setLoading(false);
        return;
      }

      console.log("📊 Sesión encontrada:", session ? "Sí" : "No");

      if (session?.user) {
        await handleUserSession(session.user);
      } else {
        // No hay sesión, ir a welcome
        setUser(null);
        setUserProfile(null);
        setCurrentView("welcome");
      }
    } catch (error) {
      console.error("💥 Error en checkUser:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSession = async (userData) => {
    try {
      console.log("👤 Procesando sesión para:", userData.email);

      const profile = await loadUserProfile(userData.email);
      setUser({ email: userData.email });
      setUserProfile(profile);
      setCurrentView("dashboard");

      // Actualizar último acceso
      await updateLastAccess(userData.email);

      console.log("✅ Sesión establecida correctamente");
    } catch (error) {
      console.error("❌ Error en handleUserSession:", error);
      setCurrentView("welcome");
    }
  };

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (email) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.warn("⚠️ Usuario no encontrado en tabla, creando perfil...");
        return await createUserProfile(email);
      }

      console.log("📋 Perfil cargado:", data);
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

  // Función para actualizar último acceso
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
    console.log("🚀 Iniciando sesión para:", email);
    setCurrentView("dashboard");
  };

  const handleRegister = async (email) => {
    console.log("🎉 Registro exitoso para:", email);
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    try {
      console.log("👋 Cerrando sesión...");

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
      setCurrentView("welcome");

      console.log("✅ Sesión cerrada correctamente");
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

  // Función para navegación entre páginas
  const navigateTo = (view) => {
    console.log("🧭 Navegando a:", view);
    setCurrentView(view);
  };

  // Loading component mejorado
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
