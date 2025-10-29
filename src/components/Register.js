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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Guardar en tabla usuarios
        const { error: dbError } = await supabase.from("usuarios").insert([
          {
            email: formData.email,
            nombre: formData.nombre || formData.email.split("@")[0],
            tipo_usuario: "usuario_registrado",
          },
        ]);

        if (dbError) {
          console.warn("Error guardando en tabla usuarios:", dbError);
          // Continuamos aunque falle el registro en la tabla
        }

        alert("¡Registro exitoso! Revisa tu email para confirmar la cuenta.");
        onRegister(formData.email);
      }
    } catch (error) {
      alert("Error en el registro: " + error.message);
      console.error("Error completo:", error);
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

        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
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
