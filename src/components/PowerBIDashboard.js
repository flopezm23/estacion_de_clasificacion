import React from "react";
import "./PowerBIDashboard.css";

const PowerBIDashboard = () => {
  const powerBiUrl =
    "https://app.powerbi.com/view?r=eyJrIjoiNzFjNjFiNDItODA3Yi00MjM3LThhOGItNDkxMzVjYTc0ZTUzIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9";

  return (
    <div className="powerbi-container">
      <h2>📊 Dashboard de Power BI</h2>
      <p>Análisis avanzado de datos de clasificación de residuos</p>

      <div className="powerbi-frame-container">
        <iframe
          title="Dashboard de Clasificación - Power BI"
          width="100%"
          height="700"
          src={powerBiUrl}
          frameBorder="0"
          allowFullScreen={true}
          onLoad={() => console.log("Power BI loaded successfully")}
          onError={(e) => console.error("Error loading Power BI:", e)}
        ></iframe>
      </div>

      <div className="powerbi-controls">
        <button onClick={() => window.open(powerBiUrl, "_blank")}>
          <i className="fas fa-external-link-alt"></i> Abrir en ventana nueva
        </button>
        <button
          onClick={() =>
            document.querySelector("iframe").contentWindow.location.reload()
          }
        >
          <i className="fas fa-sync-alt"></i> Recargar dashboard
        </button>
      </div>

      <div className="powerbi-info">
        <h4>🚀 Dashboard Interactivo</h4>
        <ul>
          <li>Visualizaciones en tiempo real de los datos de clasificación</li>
          <li>Filtros interactivos por fecha y tipo de residuo</li>
          <li>Métricas de precisión y eficiencia del sistema</li>
          <li>Análisis comparativos y tendencias</li>
        </ul>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
