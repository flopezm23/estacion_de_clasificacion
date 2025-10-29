import React, { useState } from "react";
import { supabase } from "../config/supabase";

const Register = ({ onRegister, onSwitchToLogin, onBackToWelcome }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Registrar usuario en Auth sin confirmación de email requerida
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            name: formData.nombre || formData.email.split("@")[0],
          },
          // No requerir verificación de email para desarrollo
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Guardar en tabla usuarios inmediatamente
        const { error: dbError } = await supabase.from("usuarios").insert([
          {
            email: formData.email.trim().toLowerCase(),
            nombre: formData.nombre || formData.email.split("@")[0],
            tipo_usuario: "usuario",
          },
        ]);

        if (dbError) {
          console.warn("Error guardando en tabla usuarios:", dbError);
        }

        setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");

        // Esperar un momento antes de redirigir
        setTimeout(() => {
          onRegister(formData.email);
        }, 2000);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setMessage("Error en el registro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <button className="back-btn" onClick={onBackToWelcome}>
          <i className="fas fa-arrow-left"></i> Volver al Inicio
        </button>

        <h2>Crear Cuenta</h2>

        {message && (
          <div
            className={`auth-message ${
              message.includes("Error") ? "error" : "success"
            }`}
          >
            <i
              className={`fas ${
                message.includes("Error")
                  ? "fa-exclamation-triangle"
                  : "fa-check-circle"
              }`}
            ></i>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo (opcional)</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              disabled={loading}
            />
          </div>
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
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Contraseña (mínimo 6 caracteres)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            ¿Ya tienes cuenta?{" "}
            <button type="button" onClick={onSwitchToLogin}>
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
