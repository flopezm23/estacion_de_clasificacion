import React, { useState } from "react";
import PowerBIDashboard from "./PowerBIDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="dashboard">
      <h2>Dashboard de Monitoreo</h2>
      <p>Análisis completo de datos de clasificación</p>

      {/* Pestañas de navegación */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          <i className="fas fa-chart-bar"></i> Estadísticas
        </button>
        <button
          className={activeTab === "powerbi" ? "active" : ""}
          onClick={() => setActiveTab("powerbi")}
        >
          <i className="fas fa-chart-line"></i> Power BI
        </button>
      </div>

      {/* Contenido de pestañas */}
      <div className="tab-content">
        {activeTab === "stats" && <StatsDashboard />}
        {activeTab === "powerbi" && <PowerBIDashboard />}
      </div>
    </div>
  );
};

// Componente de estadísticas (tu dashboard actual)
const StatsDashboard = () => {
  // ... tu código actual del dashboard ...
  return (
    <div>
      <h3>Estadísticas en Tiempo Real</h3>
      {/* Tu contenido actual del dashboard */}
    </div>
  );
};

export default Dashboard;
