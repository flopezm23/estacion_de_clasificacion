import React, { useState } from "react";
import { supabase } from "../config/supabase";

const Login = ({ onLogin, onSwitchToRegister, onBackToWelcome }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpiar error cuando el usuario escriba
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Usar autenticación de Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Actualizar último acceso en la tabla usuarios
        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ ultimo_acceso: new Date().toISOString() })
          .eq("email", formData.email);

        if (updateError) {
          console.warn("Error actualizando último acceso:", updateError);
        }

        onLogin(formData.email);
      }
    } catch (error) {
      console.error("Error de login:", error);
      setError(
        "Credenciales incorrectas. Por favor, verifica tu email y contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <button className="back-btn" onClick={onBackToWelcome}>
          <i className="fas fa-arrow-left"></i> Volver
        </button>

        <h2>Iniciar Sesión</h2>

        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu.email@ejemplo.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Iniciando Sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            ¿No tienes cuenta?{" "}
            <button type="button" onClick={onSwitchToRegister}>
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
