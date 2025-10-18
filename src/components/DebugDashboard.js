import React from "react";

const DebugDashboard = () => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff3cd",
        border: "1px solid #ffeaa7",
      }}
    >
      <h3>🔧 Modo Debug - Dashboard</h3>
      <p>
        Esta es una vista temporal para verificar que el componente se renderiza
      </p>
      <div style={{ marginTop: "20px" }}>
        <h4>Verifica lo siguiente:</h4>
        <ul>
          <li>✅ El archivo PowerBIDashboard.js existe en src/components/</li>
          <li>✅ La importación en Dashboard.js es correcta</li>
          <li>✅ Los nombres de las pestañas coinciden ('powerbi')</li>
          <li>✅ La URL de Power BI está asignada</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugDashboard;
