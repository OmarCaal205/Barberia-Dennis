import { Link } from "react-router-dom";

export default function Inicio({ usuario }) {
  // Manejo seguro del nombre
  const nombreUsuario = usuario?.nombre ? usuario.nombre.split(" ")[0] : "Cliente";

  return (
    <main className="inicio-container">
      <section className="hero-dark">
        <div className="hero-content">
          <p className="hero-hola">Hola, {nombreUsuario}</p>
          <h1 className="hero-title">
            Tu estilo,
            <br />
            <span className="text-gold-gradient">nuestra pasión</span>
          </h1>
          <p className="hero-sub">
            Un servicio profesional, con la mejor atención y el estilo que te
            hace destacar. Agenda tu cita y deja que la IA te sugiera tu próximo corte.
          </p>
          <div className="hero-btns">
            <Link to="/agendar" className="btn-gold">
              Agendar cita
            </Link>
            <Link to="/servicios" className="btn-ghost-hero">
              Ver servicios
            </Link>
          </div>
        </div>

        <div className="hero-foto-wrapper">
          <div className="hero-foto-frame">
            {/* Ruta corregida a .jpeg */}
            <img src="/dennis.jpeg" alt="Dennis, barbero" className="hero-img" />
          </div>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Dennis, barbero</span>
          </div>
        </div>
      </section>

      <section className="hero-features">
        <div className="feat-card">
          <span className="feat-icon">✂</span>
          <div className="feat-text">
            <strong>Barberos profesionales</strong>
            <p>con experiencia</p>
          </div>
        </div>

        <div className="feat-card">
          <span className="feat-icon">★</span>
          <div className="feat-text">
            <strong>Ambiente cómodo</strong>
            <p>y seguro</p>
          </div>
        </div>

        <div className="feat-card">
          <span className="feat-icon">✦</span>
          <div className="feat-text">
            <strong>Recomendación de estilo</strong>
            <p>con inteligencia artificial</p>
          </div>
        </div>
      </section>
    </main>
  );
}