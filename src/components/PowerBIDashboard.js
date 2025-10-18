import React from "react";
import "./PowerBIDashboard.css";

const PowerBIDashboard = () => {
  const powerBiUrl =
    "https://app.powerbi.com/view?r=eyJrIjoiNzFjNjFiNDItODA3Yi00MjM3LThhOGItNDkxMzVjYTc0ZTUzIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9";

  return (
    <div className="powerbi-fullpage">
      <div className="powerbi-header">
        <h1>🚀 Dashboard Power BI</h1>
        <p>Análisis avanzado e interactivo de los datos de clasificación</p>
      </div>

      <div className="powerbi-container-full">
        <iframe
          title="Dashboard Completo de Power BI"
          width="100%"
          height="800"
          src={powerBiUrl}
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>

      <div className="powerbi-actions">
        <button
          onClick={() => window.open(powerBiUrl, "_blank")}
          className="action-btn primary"
        >
          <i className="fas fa-external-link-alt"></i> Abrir en nueva ventana
        </button>
        <button
          onClick={() => window.history.back()}
          className="action-btn secondary"
        >
          <i className="fas fa-arrow-left"></i> Volver a Reportes
        </button>
      </div>

      <div className="powerbi-features">
        <h3>✨ Características del Dashboard</h3>
        <div className="features-grid">
          <div className="feature-item">
            <i className="fas fa-filter"></i>
            <h4>Filtros Interactivos</h4>
            <p>
              Filtra datos por fecha, tipo de residuo y métricas específicas
            </p>
          </div>
          <div className="feature-item">
            <i className="fas fa-sync-alt"></i>
            <h4>Tiempo Real</h4>
            <p>Datos actualizados automáticamente desde la base de datos</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-chart-pie"></i>
            <h4>Múltiples Visualizaciones</h4>
            <p>Gráficos, tablas y KPIs para análisis completo</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-download"></i>
            <h4>Exportación</h4>
            <p>Exporta reportes en diferentes formatos para tu tesis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
