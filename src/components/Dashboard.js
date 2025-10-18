import React, { useState } from "react";
import PowerBIDashboard from "./PowerBIDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("stats"); // ← Por defecto muestra estadísticas

  return (
    <div className="dashboard">
      <h2>Dashboard de Monitoreo</h2>
      <p>Sistema de clasificación de residuos - Datos en tiempo real</p>

      {/* Pestañas de navegación */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          <i className="fas fa-chart-bar"></i> Estadísticas Básicas
        </button>
        <button
          className={activeTab === "powerbi" ? "active" : ""}
          onClick={() => setActiveTab("powerbi")}
        >
          <i className="fas fa-chart-line"></i> Power BI Avanzado
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {activeTab === "stats" && <StatsDashboard />}
        {activeTab === "powerbi" && <PowerBIDashboard />}
      </div>
    </div>
  );
};

// Tu dashboard de estadísticas actual
const StatsDashboard = () => {
  // ... tu código existente del dashboard con Supabase ...
  return (
    <div>
      <h3>Estadísticas en Tiempo Real</h3>
      <p>Datos directos desde la base de datos Supabase</p>
      {/* Tu contenido actual aquí */}
    </div>
  );
};

export default Dashboard;
