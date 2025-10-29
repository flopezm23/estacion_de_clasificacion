import React from "react";
import "./ReciclajeInfo.css";

const ReciclajeInfo = () => {
  const materiales = [
    {
      nombre: "Papel",
      icono: "fas fa-file-alt",
      color: "#2196F3",
      descripcion: "Periódicos, revistas, cuadernos, cartones de huevo",
      proceso: "Se tritura y mezcla con agua para crear pulpa nueva",
      noIncluir: "Papel higiénico, papeles engrasados o con comida",
    },
    {
      nombre: "Vidrio",
      icono: "fas fa-wine-bottle",
      color: "#4CAF50",
      descripcion: "Botellas, frascos, envases de alimentos",
      proceso: "Se tritura y funde para crear nuevos envases",
      noIncluir: "Espejos, cristales de ventanas, porcelana",
    },
    {
      nombre: "Plástico",
      icono: "fas fa-wine-bottle",
      color: "#FF9800",
      descripcion: "Botellas PET, envases de limpieza, tapas",
      proceso: "Se clasifica por tipo, tritura y funde para nuevos productos",
      noIncluir: "Bolsas plásticas, juguetes, utensilios de cocina",
    },
    {
      nombre: "Aluminio",
      icono: "fas fa-beer",
      color: "#795548",
      descripcion: "Latas de bebidas, bandejas de aluminio",
      proceso: "Se funde y reutiliza infinitamente sin perder calidad",
      noIncluir: "Papel aluminio usado, aerosoles",
    },
    {
      nombre: "Cartón",
      icono: "fas fa-archive",
      color: "#8BC34A",
      descripcion: "Cajas de embalaje, envases de productos",
      proceso: "Se recicla similar al papel pero con procesos más intensivos",
      noIncluir: "Cartones con restos de comida o grasas",
    },
  ];

  const beneficios = [
    {
      icon: "fas fa-tree",
      title: "Ahorro de recursos",
      desc: "Reduce la tala de árboles y minería",
    },
    {
      icon: "fas fa-bolt",
      title: "Ahorro energético",
      desc: "Usa menos energía que producir nuevos materiales",
    },
    {
      icon: "fas fa-water",
      title: "Menos contaminación",
      desc: "Reduce la contaminación del agua y aire",
    },
    {
      icon: "fas fa-landmark",
      title: "Creación de empleos",
      desc: "Genera empleos en la industria del reciclaje",
    },
  ];

  return (
    <div className="reciclaje-info">
      <div className="reciclaje-header">
        <h1>♻️ Guía de Reciclaje</h1>
        <p>
          Aprende a reciclar correctamente y contribuye al cuidado del medio
          ambiente
        </p>
      </div>

      <section className="materiales-section">
        <h2>📦 Materiales Reciclables</h2>
        <div className="materiales-grid">
          {materiales.map((material, index) => (
            <div key={index} className="material-card">
              <div
                className="material-header"
                style={{ borderColor: material.color }}
              >
                <i
                  className={material.icono}
                  style={{ color: material.color }}
                ></i>
                <h3>{material.nombre}</h3>
              </div>
              <div className="material-content">
                <p>
                  <strong>✅ Incluir:</strong> {material.descripcion}
                </p>
                <p>
                  <strong>🔄 Proceso:</strong> {material.proceso}
                </p>
                <p>
                  <strong>❌ No incluir:</strong> {material.noIncluir}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="beneficios-section">
        <h2>🌟 Beneficios del Reciclaje</h2>
        <div className="beneficios-grid">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="beneficio-card">
              <i className={beneficio.icon}></i>
              <h4>{beneficio.title}</h4>
              <p>{beneficio.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="consejos-section">
        <h2>💡 Consejos para Reciclar Mejor</h2>
        <div className="consejos-list">
          <div className="consejo-item">
            <i className="fas fa-shower"></i>
            <div>
              <h4>Limpia los envases</h4>
              <p>Enjuaga botellas y latas antes de reciclarlas</p>
            </div>
          </div>
          <div className="consejo-item">
            <i className="fas fa-compress-arrows-alt"></i>
            <div>
              <h4>Compacta cuando sea posible</h4>
              <p>Aplasta latas y botellas para ahorrar espacio</p>
            </div>
          </div>
          <div className="consejo-item">
            <i className="fas fa-seedling"></i>
            <div>
              <h4>Separa correctamente</h4>
              <p>Usa contenedores diferentes para cada material</p>
            </div>
          </div>
          <div className="consejo-item">
            <i className="fas fa-book"></i>
            <div>
              <h4>Infórmate</h4>
              <p>Conoce las normas de reciclaje de tu localidad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReciclajeInfo;
