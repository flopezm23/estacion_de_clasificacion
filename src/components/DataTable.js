import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos desde Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: clasificaciones, error } = await supabase
        .from("clasificaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setData(clasificaciones || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Función para descargar datos como CSV
  const handleDownloadCSV = () => {
    if (data.length === 0) {
      alert("No hay datos para descargar");
      return;
    }

    const headers = [
      "ID",
      "Fecha",
      "Hora",
      "Tipo Residuo",
      "Estado",
      "Confianza",
      "Humedad",
      "Humo (PPM)",
      "Timestamp",
    ];
    const csvData = data.map((item) => [
      item.id,
      item.fecha,
      item.hora,
      item.tipo_residuo,
      item.estado,
      item.confianza,
      item.humedad,
      item.humo_ppm,
      item.timestamp,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datos_clasificacion_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    alert("Datos descargados exitosamente en formato CSV");
  };

  // Función para formatear la fecha
  const formatDateTime = (fecha, hora) => {
    return `${fecha} ${hora}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando datos desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchData}>
          <i className="fas fa-redo"></i> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="data-header">
        <h2>Datos de Clasificación - Raspberry Pi</h2>
        <p>Información recolectada del sistema de clasificación de residuos</p>

        <div className="data-stats">
          <div className="stat-badge">
            <i className="fas fa-database"></i>
            <span>Total registros: {data.length}</span>
          </div>
          <div className="stat-badge">
            <i className="fas fa-recycle"></i>
            <span>
              Tipos de residuo:{" "}
              {new Set(data.map((item) => item.tipo_residuo)).size}
            </span>
          </div>
        </div>
      </div>

      <div className="download-buttons">
        <button className="download-btn" onClick={handleDownloadCSV}>
          <i className="fas fa-download"></i> Descargar CSV
        </button>
        <button className="download-btn refresh-btn" onClick={fetchData}>
          <i className="fas fa-sync-alt"></i> Actualizar Datos
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Tipo Residuo</th>
              <th>Estado</th>
              <th>Confianza</th>
              <th>Humedad</th>
              <th>Humo (PPM)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <div className="datetime-cell">
                    <span className="date">{item.fecha}</span>
                    <span className="time">{item.hora}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`residuo-badge ${item.tipo_residuo.toLowerCase()}`}
                  >
                    {item.tipo_residuo}
                  </span>
                </td>
                <td>
                  <span className={`estado-badge ${item.estado}`}>
                    {item.estado}
                  </span>
                </td>
                <td>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${item.confianza * 100}%` }}
                    ></div>
                    <span className="confidence-text">
                      {(item.confianza * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td>
                  <div className="sensor-value">
                    <i className="fas fa-tint"></i>
                    {item.humedad}%
                  </div>
                </td>
                <td>
                  <div className="sensor-value">
                    <i className="fas fa-smog"></i>
                    {item.humo_ppm} ppm
                  </div>
                </td>
                <td>
                  <span className="timestamp">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="no-data">
          <i className="fas fa-inbox"></i>
          <h3>No hay datos disponibles</h3>
          <p>No se han encontrado registros en la base de datos</p>
        </div>
      )}

      <div className="table-info">
        <p>Mostrando {data.length} registros de clasificación</p>
        <p>Última actualización: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DataTable;
