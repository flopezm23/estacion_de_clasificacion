import React from "react";
import "./EstacionClasificadora.css";

const EstacionClasificadora = () => {
  const caracteristicas = [
    {
      icono: "fas fa-robot",
      titulo: "Inteligencia Artificial",
      descripcion:
        "Modelos de machine learning entrenados para identificar materiales",
    },
    {
      icono: "fas fa-camera",
      titulo: "Visión por Computadora",
      descripcion: "Sistema de cámaras que captura imágenes en tiempo real",
    },
    {
      icono: "fas fa-microchip",
      titulo: "Raspberry Pi 5",
      descripcion:
        "Procesamiento local con la última tecnología en microcomputadoras",
    },
    {
      icono: "fas fa-database",
      titulo: "Base de Datos en Tiempo Real",
      descripcion: "Almacenamiento y análisis inmediato de cada clasificación",
    },
  ];

  const proceso = [
    {
      paso: 1,
      titulo: "Captura de Imagen",
      descripcion: "El residuo es fotografiado por el sistema de cámaras",
    },
    {
      paso: 2,
      titulo: "Procesamiento IA",
      descripcion:
        "El modelo predictivo analiza la imagen y clasifica el material",
    },
    {
      paso: 3,
      titulo: "Validación",
      descripcion: "Se calcula el porcentaje de confianza de la clasificación",
    },
    {
      paso: 4,
      titulo: "Almacenamiento",
      descripcion: "Los datos se guardan en la base de datos para análisis",
    },
    {
      paso: 5,
      titulo: "Visualización",
      descripcion: "Resultados disponibles en tiempo real en el dashboard",
    },
  ];

  return (
    <div className="estacion-clasificadora">
      <div className="estacion-header">
        <h1>🔬 Estación Clasificadora Inteligente</h1>
        <p>
          Sistema automatizado de clasificación de residuos usando modelos
          predictivos de IA
        </p>
      </div>

      <section className="tecnologia-section">
        <h2>🚀 Tecnología Implementada</h2>
        <div className="tecnologia-grid">
          {caracteristicas.map((item, index) => (
            <div key={index} className="tecnologia-card">
              <i className={item.icono}></i>
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="proceso-section">
        <h2>📋 Proceso de Clasificación</h2>
        <div className="proceso-timeline">
          {proceso.map((paso, index) => (
            <div key={index} className="proceso-paso">
              <div className="paso-numero">{paso.paso}</div>
              <div className="paso-content">
                <h4>{paso.titulo}</h4>
                <p>{paso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="modelos-section">
        <h2>🧠 Modelos Predictivos</h2>
        <div className="modelos-info">
          <div className="modelo-card">
            <h3>Redes Neuronales Convolucionales (CNN)</h3>
            <p>
              Arquitectura especializada en procesamiento de imágenes para
              identificar patrones visuales en los residuos.
            </p>
            <ul>
              <li>Precisión: 95% en condiciones controladas</li>
              <li>Entrenamiento: 10,000+ imágenes etiquetadas</li>
              <li>Tiempo de inferencia: menor a 2 segundos</li>
            </ul>
          </div>

          <div className="modelo-card">
            <h3>Preprocesamiento de Imágenes</h3>
            <p>
              Técnicas avanzadas para mejorar la calidad de las imágenes antes
              del análisis.
            </p>
            <ul>
              <li>Normalización de colores</li>
              <li>Reducción de ruido</li>
              <li>Aumento de datos en tiempo real</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="metricas-section">
        <h2>📊 Métricas del Sistema</h2>
        <div className="metricas-grid">
          <div className="metrica-card">
            <h4>95%</h4>
            <p>Precisión en clasificación</p>
          </div>
          <div className="metrica-card">
            <h4>Menor a 2s</h4>
            <p>Tiempo de procesamiento</p>
          </div>
          <div className="metrica-card">
            <h4>5</h4>
            <p>Materiales identificados</p>
          </div>
          <div className="metrica-card">
            <h4>24/7</h4>
            <p>Operación continua</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EstacionClasificadora;
