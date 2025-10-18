import React from "react";
import "./PowerBIDashboard.css";

const PowerBIDashboard = () => {
  // Reemplaza con tu URL real de Power BI
  const powerBiUrl =
    "https://app.powerbi.com/view?r=eyJrIjoiNzFjNjFiNDItODA3Yi00MjM3LThhOGItNDkxMzVjYTc0ZTUzIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9";

  return (
    <div className="powerbi-container">
      <h2>Dashboard de Power BI</h2>
      <p>Análisis avanzado de datos de clasificación</p>

      <div className="powerbi-frame-container">
        <iframe
          title="Power BI Dashboard"
          width="100%"
          height="600"
          src={powerBiUrl}
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>

      <div className="powerbi-info">
        <h4>📊 Características del Dashboard</h4>
        <ul>
          <li>Visualizaciones interactivas en tiempo real</li>
          <li>Filtros y segmentaciones de datos</li>
          <li>Métricas clave de clasificación</li>
          <li>Análisis temporal y comparativo</li>
        </ul>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
