import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const Dashboard = () => {
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

      // Obtener todos los registros
      const { data: clasificaciones, error } = await supabase
        .from("clasificaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (clasificaciones && clasificaciones.length > 0) {
        // Calcular estadísticas
        const totalRegistros = clasificaciones.length;

        // Contar por tipo de residuo
        const residuosPorTipo = clasificaciones.reduce((acc, item) => {
          acc[item.tipo_residuo] = (acc[item.tipo_residuo] || 0) + 1;
          return acc;
        }, {});

        // Calcular promedio de confianza
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

    // Opcional: Configurar actualización automática cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Dashboard de Monitoreo - Raspberry Pi</h2>
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
          <h3>Última Clasificación</h3>
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
                  {stats.ultimaClasificacion.fecha}{" "}
                  {stats.ultimaClasificacion.hora}
                </span>
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

      {/* Lugar para Power BI */}
      <div className="powerbi-section">
        <h3>Dashboard Power BI Integrado</h3>
        <div className="dashboard-placeholder">
          <i className="fas fa-chart-bar"></i>
          <h4>Visualizaciones Avanzadas</h4>
          <p>
            Aquí se integrará el dashboard de Power BI para análisis más
            detallados
          </p>
          <div className="powerbi-stats">
            <div className="powerbi-stat">
              <i className="fas fa-sync-alt"></i>
              <span>Datos en tiempo real</span>
            </div>
            <div className="powerbi-stat">
              <i className="fas fa-chart-pie"></i>
              <span>Gráficos interactivos</span>
            </div>
            <div className="powerbi-stat">
              <i className="fas fa-download"></i>
              <span>Reportes automáticos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
