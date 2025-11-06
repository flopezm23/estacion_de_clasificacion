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
  const [authChecked, setAuthChecked] = useState(false);

  // Efecto principal para verificar autenticación
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔄 Inicializando autenticación...");

        // Timeout de seguridad de 8 segundos
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log("⏰ Timeout: Forzando fin de loading");
            setLoading(false);
            setAuthChecked(true);
            setCurrentView("welcome");
          }
        }, 8000);

        // Verificar sesión actual
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Error obteniendo sesión:", error);
          throw error;
        }

        if (session?.user && mounted) {
          console.log("✅ Sesión encontrada:", session.user.email);
          await handleUserAuthenticated(session.user);
        } else if (mounted) {
          console.log("ℹ️ No hay sesión activa");
          setUser(null);
          setUserProfile(null);
          setCurrentView("welcome");
        }

        clearTimeout(timeoutId);
      } catch (error) {
        console.error("💥 Error en inicialización:", error);
        if (mounted) {
          setCurrentView("welcome");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    initializeAuth();

    // Configurar listener de cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("🔐 Evento de auth:", event);

      switch (event) {
        case "SIGNED_IN":
          if (session) {
            await handleUserAuthenticated(session.user);
          }
          break;

        case "SIGNED_OUT":
          handleUserSignedOut();
          break;

        case "TOKEN_REFRESHED":
          console.log("Token refrescado");
          break;

        case "USER_UPDATED":
          console.log("Usuario actualizado");
          break;

        default:
          console.log("Evento no manejado:", event);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUserAuthenticated = async (userData) => {
    try {
      console.log("👤 Autenticando usuario:", userData.email);

      // Primero establecer el usuario básico
      setUser({
        email: userData.email,
        id: userData.id,
      });

      // Cargar perfil en segundo plano
      loadUserProfile(userData.email)
        .then((profile) => {
          setUserProfile(profile);
        })
        .catch((error) => {
          console.error("Error cargando perfil:", error);
        });

      // Actualizar último acceso
      updateLastAccess(userData.email).catch(console.error);

      // Cambiar vista solo si es necesario
      if (["welcome", "login", "register"].includes(currentView)) {
        setCurrentView("dashboard");
      }

      console.log("✅ Autenticación completada");
    } catch (error) {
      console.error("❌ Error en autenticación:", error);
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
        console.warn("⚠️ Usuario no encontrado, creando perfil...");
        return await createUserProfile(email);
      }

      console.log("✅ Perfil cargado");
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

      console.log("✅ Perfil creado");
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

  const handleLogin = (email) => {
    console.log("🚀 Login iniciado para:", email);
  };

  const handleRegister = (email) => {
    console.log("🎉 Registro iniciado para:", email);
  };

  const handleLogout = async () => {
    try {
      console.log("👋 Cerrando sesión...");
      await supabase.auth.signOut();
      // El estado se actualizará por onAuthStateChange
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

  // Loading component mejorado
  if (loading && !authChecked) {
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
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    console.log("🎬 Renderizando vista:", currentView);
    console.log("👤 Usuario:", user ? user.email : "No autenticado");

    // Si ya verificamos auth pero no hay usuario, mostrar welcome
    if (
      authChecked &&
      !user &&
      currentView !== "welcome" &&
      currentView !== "login" &&
      currentView !== "register"
    ) {
      return <Welcome onStart={handleStart} />;
    }

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
        return user ? (
          <Dashboard onNavigate={navigateTo} />
        ) : (
          <Welcome onStart={handleStart} />
        );

      case "powerbi":
        return user ? <PowerBIDashboard /> : <Welcome onStart={handleStart} />;

      case "data":
        return user ? <DataTable /> : <Welcome onStart={handleStart} />;

      case "reciclaje":
        return user ? <ReciclajeInfo /> : <Welcome onStart={handleStart} />;

      case "estacion":
        return user ? (
          <EstacionClasificadora />
        ) : (
          <Welcome onStart={handleStart} />
        );

      case "admin":
        return user && isAdmin() ? (
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

        {/* NAVEGACIÓN - Mostrar solo si hay usuario autenticado y auth ya fue verificada */}
        {user && authChecked && (
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
          Sistema de Monitoreo - Estacion Clasificatoria |
          {user && authChecked
            ? ` Usuario: ${user.email} ${isAdmin() ? "(Admin)" : ""}`
            : " No autenticado"}
        </p>
      </footer>
    </div>
  );
}

export default App;
