import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import "./AdminUsuarios.css";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("fecha_registro", { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      setError("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchUsuarios} className="retry-btn">
          <i className="fas fa-redo"></i> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="admin-usuarios">
      <div className="admin-header">
        <h2>👥 Panel de Administración - Usuarios Registrados</h2>
        <p>Total: {usuarios.length} usuarios en el sistema</p>
        <button onClick={fetchUsuarios} className="refresh-btn">
          <i className="fas fa-sync-alt"></i> Actualizar
        </button>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Fecha Registro</th>
              <th>Tipo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="email-cell">{usuario.email}</td>
                <td>{usuario.nombre || "No especificado"}</td>
                <td>{new Date(usuario.fecha_registro).toLocaleString()}</td>
                <td>
                  <span className={`badge ${usuario.tipo_usuario}`}>
                    {usuario.tipo_usuario}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${
                      usuario.activo ? "active" : "inactive"
                    }`}
                  >
                    {usuario.activo ? "✅ Activo" : "❌ Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="no-usuarios">
          <i className="fas fa-users-slash"></i>
          <h3>No hay usuarios registrados</h3>
          <p>Los usuarios aparecerán aquí cuando se registren en el sistema.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
