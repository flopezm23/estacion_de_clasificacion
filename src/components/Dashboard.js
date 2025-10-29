import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalRegistros: 0,
    residuosPorTipo: {},
    promedioConfianza: 0,
    ultimaClasificacion: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data: clasificaciones, error } = await supabase
        .from("clasificaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (clasificaciones && clasificaciones.length > 0) {
        const totalRegistros = clasificaciones.length;

        const residuosPorTipo = clasificaciones.reduce((acc, item) => {
          acc[item.tipo_residuo] = (acc[item.tipo_residuo] || 0) + 1;
          return acc;
        }, {});

        const promedioConfianza =
          clasificaciones.reduce((sum, item) => sum + item.confianza, 0) /
          totalRegistros;

        setStats({
          totalRegistros,
          residuosPorTipo,
          promedioConfianza,
          ultimaClasificacion: clasificaciones[0],
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>📊 Reportes Generales</h2>
      <p>Estadísticas en tiempo real del sistema de clasificación</p>

      {/* Estadísticas principales */}
      <div className="dashboard-stats-main">
        <div className="stat-card main">
          <i className="fas fa-database"></i>
          <div className="stat-content">
            <h3>{stats.totalRegistros}</h3>
            <p>Total Clasificaciones</p>
          </div>
        </div>

        <div className="stat-card main">
          <i className="fas fa-chart-line"></i>
          <div className="stat-content">
            <h3>{(stats.promedioConfianza * 100).toFixed(1)}%</h3>
            <p>Confianza Promedio</p>
          </div>
        </div>

        <div className="stat-card main">
          <i className="fas fa-recycle"></i>
          <div className="stat-content">
            <h3>{Object.keys(stats.residuosPorTipo).length}</h3>
            <p>Tipos de Residuos</p>
          </div>
        </div>
      </div>

      {/* Última clasificación */}
      {stats.ultimaClasificacion && (
        <div className="last-classification">
          <h3>Última Clasificación Registrada</h3>
          <div className="last-classification-card">
            <div className="classification-info">
              <span className="residuo-type">
                {stats.ultimaClasificacion.tipo_residuo}
              </span>
              <span className="confidence">
                {(stats.ultimaClasificacion.confianza * 100).toFixed(1)}% de
                confianza
              </span>
            </div>
            <div className="classification-details">
              <div className="detail">
                <i className="fas fa-calendar"></i>
                <span>
                  {new Date(
                    stats.ultimaClasificacion.timestamp * 1000
                  ).toLocaleString("es-ES")}
                </span>
                <small style={{ color: "#28a745", marginLeft: "8px" }}>
                  <i className="fas fa-check-circle"></i> Timestamp
                </small>
              </div>
              <div className="detail">
                <i className="fas fa-tint"></i>
                <span>Humedad: {stats.ultimaClasificacion.humedad}%</span>
              </div>
              <div className="detail">
                <i className="fas fa-smog"></i>
                <span>Humo: {stats.ultimaClasificacion.humo_ppm} ppm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribución por tipo de residuo */}
      <div className="distribution-section">
        <h3>Distribución por Tipo de Residuo</h3>
        <div className="distribution-cards">
          {Object.entries(stats.residuosPorTipo).map(([tipo, cantidad]) => (
            <div key={tipo} className="distribution-card">
              <span className="tipo-name">{tipo}</span>
              <span className="tipo-count">{cantidad}</span>
              <div className="tipo-bar">
                <div
                  className="tipo-fill"
                  style={{
                    width: `${(cantidad / stats.totalRegistros) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="quick-access">
        <h3>🚀 Navegación Rápida</h3>
        <div className="quick-actions">
          <button
            className="quick-btn primary"
            onClick={() => onNavigate("powerbi")}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard Power BI</span>
          </button>
          <button
            className="quick-btn secondary"
            onClick={() => onNavigate("data")}
          >
            <i className="fas fa-database"></i>
            <span>Ver Todos los Datos</span>
          </button>
          <button
            className="quick-btn secondary"
            onClick={() => onNavigate("estacion")}
          >
            <i className="fas fa-robot"></i>
            <span>Info Estación</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
