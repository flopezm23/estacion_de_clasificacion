import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error en callback de autenticación:", error);
          navigate("/#error=auth_failed");
          return;
        }

        if (session) {
          // Autenticación exitosa
          navigate("/dashboard");
        } else {
          // No hay sesión
          navigate("/login");
        }
      } catch (error) {
        console.error("Error manejando callback:", error);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback">
      <i className="fas fa-spinner fa-spin"></i>
      <p>Procesando autenticación...</p>
    </div>
  );
};

export default AuthCallback;
