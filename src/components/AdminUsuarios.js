import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import "./AdminUsuarios.css";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

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

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ tipo_usuario: newRole })
        .eq("id", userId);

      if (error) throw error;

      // Actualizar la lista local
      setUsuarios(
        usuarios.map((user) =>
          user.id === userId ? { ...user, tipo_usuario: newRole } : user
        )
      );

      alert("Rol actualizado exitosamente");
    } catch (error) {
      alert("Error actualizando rol: " + error.message);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ activo: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      // Actualizar la lista local
      setUsuarios(
        usuarios.map((user) =>
          user.id === userId ? { ...user, activo: !currentStatus } : user
        )
      );

      alert("Estado actualizado exitosamente");
    } catch (error) {
      alert("Error actualizando estado: " + error.message);
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
        <h2>👥 Panel de Administración - Gestión de Usuarios</h2>
        <div className="admin-stats">
          <span>Total: {usuarios.length} usuarios</span>
          <span>
            Admins: {usuarios.filter((u) => u.tipo_usuario === "admin").length}
          </span>
          <span>Activos: {usuarios.filter((u) => u.activo).length}</span>
        </div>
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
              <th>Último Acceso</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className={!usuario.activo ? "inactive-user" : ""}
              >
                <td className="email-cell">{usuario.email}</td>
                <td>{usuario.nombre || "No especificado"}</td>
                <td>{new Date(usuario.fecha_registro).toLocaleString()}</td>
                <td>
                  {usuario.ultimo_acceso
                    ? new Date(usuario.ultimo_acceso).toLocaleString()
                    : "Nunca"}
                </td>
                <td>
                  <select
                    value={usuario.tipo_usuario}
                    onChange={(e) => updateUserRole(usuario.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="visor">Visor</option>
                  </select>
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
                <td className="actions-cell">
                  <button
                    onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                    className={`status-btn ${
                      usuario.activo ? "deactivate" : "activate"
                    }`}
                  >
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>
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

      <div className="admin-notes">
        <h4>📝 Notas de Administración</h4>
        <ul>
          <li>
            <strong>Administrador:</strong> Acceso completo a todas las
            funciones
          </li>
          <li>
            <strong>Usuario:</strong> Acceso normal a reportes y datos
          </li>
          <li>
            <strong>Visor:</strong> Solo puede ver reportes, no modificar datos
          </li>
          <li>Los usuarios inactivos no pueden iniciar sesión</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUsuarios;
