import React from "react";
import "./Welcome.css";

const Welcome = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <i className="fas fa-recycle welcome-icon"></i>
          <h1>Bienvenido a Estación clasificatoria de reciclaje</h1>
          <p>
            Etación clasificatoria de desechos reciclables que aplica modelos
            predictivos
          </p>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <i className="fas fa-chart-bar"></i>
            <h3>Dashboard Interactivo</h3>
            <p>
              Visualiza tus datos con gráficos profesionales integrados con
              Power BI
            </p>
          </div>

          <div className="feature-card">
            <i className="fas fa-database"></i>
            <h3>Gestión de Datos</h3>
            <p>Exporta y gestiona la información recolectada</p>
          </div>

          <div className="feature-card">
            <i className="fas fa-download"></i>
            <h3>Descargas</h3>
            <p>
              Obtén reportes en múltiples formatos para mejorar tus campañas
            </p>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="welcome-btn primary" onClick={onStart}>
            <i className="fas fa-rocket"></i>
            Comenzar Ahora
          </button>
          {/*
          <button className="welcome-btn secondary">
            <i className="fas fa-info-circle"></i>
            Más Información
          </button>
          */}
        </div>
        {/*Corrigiendo datos*/}
        <div className="welcome-footer">
          <p>Sistema desarrollado para Estación Clasificatoria</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
