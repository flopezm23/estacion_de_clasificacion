import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import "./EstacionClasificadora.css";

const EstacionClasificadora = () => {
  const [metricasReales, setMetricasReales] = useState({
    totalClasificaciones: 0,
    precisionPromedio: 0,
    materialesIdentificados: 0,
    ultimaClasificacion: null,
  });
  const [loading, setLoading] = useState(true);
  const [imagenesGaleria, setImagenesGaleria] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const cargarMetricasReales = async () => {
    try {
      const { data: clasificaciones, error } = await supabase
        .from("clasificaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (clasificaciones && clasificaciones.length > 0) {
        const total = clasificaciones.length;
        const precisionPromedio =
          clasificaciones.reduce((sum, item) => sum + item.confianza, 0) /
          total;
        const materialesUnicos = new Set(
          clasificaciones.map((item) => item.tipo_residuo)
        ).size;

        setMetricasReales({
          totalClasificaciones: total,
          precisionPromedio: precisionPromedio * 100,
          materialesIdentificados: materialesUnicos,
          ultimaClasificacion: clasificaciones[0],
        });
      }
    } catch (err) {
      console.error("Error cargando métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarImagenesGaleria = () => {
    const imagenesReales = [
      {
        id: 1,
        src: "public/imagenes/estacion_interior.jpg",
        alt: "Estación clasificadora",
        titulo: "Estación clasificadora en interior",
        descripcion: "Estación clasificadora operando en un entorno controlado",
      },
      {
        id: 2,
        src: "public/imagenes/estacion_uso.jpg",
        alt: "Estación en funcionamiento",
        titulo: "Estación en Uso",
        descripcion: "Uso de la estación por parte de una voluntaria ",
      },
      {
        id: 3,
        src: "public/imagenes/botes.jpg",
        alt: "Recipientes de clasificación",
        titulo: "Recipientes para residuos clasificados",
        descripcion: "Botes etiquetados para diferentes tipos de materiales",
      },
      {
        id: 4,
        src: "public/imagenes/pantalla_lcd.jpg",
        alt: "Pantalla LCD mostrando estado",
        titulo: "Pantalla LCD para mejorar la experiencia",
        descripcion:
          "El estado y los resultados son presentados también en una pantalla LCD",
      },
      {
        id: 5,
        src: "public/imagenes/sensores.jpg",
        alt: "Sensores y cámaras implementados",
        titulo: "Componentes electrónicos",
        descripcion: "Conjunto de sensores y cámara utilizados en la estación",
      },
      {
        id: 6,
        src: "public/imagenes/hoja_instrucciones.jpg",
        alt: "Instrucciones de uso",
        titulo: "Hoja de instrucciones",
        descripcion: "Instrucciones del funcionamiento básico para el usuario",
      },
    ];

    setImagenesGaleria(imagenesReales);
  };

  useEffect(() => {
    cargarMetricasReales();
    cargarImagenesGaleria();
  }, []);

  const abrirModal = (imagen) => {
    setImagenSeleccionada(imagen);
  };

  const cerrarModal = () => {
    setImagenSeleccionada(null);
  };

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
        <h2>📊 Métricas del Sistema - Datos en Tiempo Real</h2>
        {loading ? (
          <div className="loading-metricas">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Cargando métricas actuales...</p>
          </div>
        ) : (
          <>
            <div className="metricas-grid">
              <div className="metrica-card real">
                <h4>{metricasReales.totalClasificaciones}</h4>
                <p>Total Clasificaciones</p>
                <span className="metrica-source">📊 Datos reales</span>
              </div>
              <div className="metrica-card real">
                <h4>{metricasReales.precisionPromedio.toFixed(1)}%</h4>
                <p>Precisión Promedio</p>
                <span className="metrica-source">📊 Datos reales</span>
              </div>
              <div className="metrica-card real">
                <h4>{metricasReales.materialesIdentificados}</h4>
                <p>Materiales Identificados</p>
                <span className="metrica-source">📊 Datos reales</span>
              </div>
              <div className="metrica-card">
                <h4>24/7</h4>
                <p>Operación continua</p>
                <span className="metrica-source">⚡ Sistema</span>
              </div>
            </div>

            {metricasReales.ultimaClasificacion && (
              <div className="ultima-clasificacion">
                <h4>Última Clasificación Registrada</h4>
                <div className="clasificacion-info">
                  <span className="material-badge">
                    {metricasReales.ultimaClasificacion.tipo_residuo}
                  </span>
                  <span className="confianza">
                    {(
                      metricasReales.ultimaClasificacion.confianza * 100
                    ).toFixed(1)}
                    % de confianza
                  </span>
                  <span className="fecha">
                    {new Date(
                      metricasReales.ultimaClasificacion.timestamp * 1000
                    ).toLocaleString("es-ES")}
                    <small style={{ color: "#28a745", marginLeft: "8px" }}>
                      <i className="fas fa-check-circle"></i> Horario Guatemala
                    </small>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="datos-en-vivo">
        <h2>📈 ¿Quieres ver todos los datos?</h2>
        <div className="datos-actions">
          <button
            className="action-btn primary"
            onClick={() => (window.location.hash = "#/dashboard")}
          >
            <i className="fas fa-chart-bar"></i> Ver Reportes Completos
          </button>
          <button
            className="action-btn secondary"
            onClick={() => (window.location.hash = "#/data")}
          >
            <i className="fas fa-database"></i> Explorar Datos en Tabla
          </button>
        </div>
      </section>

      {/* NUEVA SECCIÓN: GALERÍA DE IMÁGENES */}
      <section className="galeria-section">
        <h2>🖼️ Galería del Sistema</h2>
        <p className="galeria-descripcion">
          Imagenes reales de la estación en funcionamiento y sus componentes.
        </p>

        <div className="galeria-grid">
          {imagenesGaleria.map((imagen) => (
            <div
              key={imagen.id}
              className="galeria-item"
              onClick={() => abrirModal(imagen)}
            >
              <div className="galeria-imagen-container">
                <img
                  src={imagen.src}
                  alt={imagen.alt}
                  className="galeria-imagen"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3E${encodeURIComponent(
                      imagen.titulo
                    )}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'%3E${encodeURIComponent(
                      imagen.tipo
                    )}%3C/text%3E%3C/svg%3E`;
                  }}
                />
                <div className="galeria-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
              <div className="galeria-info">
                <h4>{imagen.titulo}</h4>
                <p>{imagen.descripcion}</p>
                {/*
                <div className="galeria-tags">
                  <span className="tag tipo">{imagen.tipo}</span>
                  {imagen.confianza !== "N/A" && (
                    <span className="tag confianza">{imagen.confianza} confianza</span>
                  )}
                </div>
                */}
              </div>
            </div>
          ))}
        </div>

        <div className="galeria-nota">
          <p>
            <i className="fas fa-info-circle"></i>
            Estas imágenes muestran la estación clasificadora en operación real
            y sus componentes durante las pruebas.
          </p>
        </div>
      </section>

      {/* MODAL PARA VISUALIZACIÓN DE IMAGEN */}
      {imagenSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-imagen-container">
              <img
                src={imagenSeleccionada.src}
                alt={imagenSeleccionada.alt}
                className="modal-imagen"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23999'%3E${encodeURIComponent(
                    imagenSeleccionada.titulo
                  )}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'%3EImagen no disponible%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>
            <div className="modal-info">
              <h3>{imagenSeleccionada.titulo}</h3>
              <p>{imagenSeleccionada.descripcion}</p>
              {/*
              <div className="modal-details">
                <div className="detail-item">
                  <strong>Tipo:</strong> {imagenSeleccionada.tipo}
                </div>
                {imagenSeleccionada.confianza !== "N/A" && (
                  <div className="detail-item">
                    <strong>Confianza:</strong> {imagenSeleccionada.confianza}
                  </div>
                )}
              </div>
              */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstacionClasificadora;
