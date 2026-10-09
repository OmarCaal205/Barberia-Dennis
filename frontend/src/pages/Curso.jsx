import { Link } from "react-router-dom";

const TEMARIO = [
  "Herramientas, higiene y seguridad en la barbería",
  "Tipos de rostro y de cabello",
  "Fade, degradados y cortes clásicos",
  "Perfilado y arreglo de barba",
  "Atención al cliente y manejo de agenda",
  "Cómo emprender y fijar tus precios",
];

export default function Curso() {
  return (
    <div className="container-narrow" style={{ paddingTop: "3rem" }}>
      <span className="eyebrow-tag">Formación</span>
      <h2>Curso de barbería profesional</h2>
      <p style={{ opacity: 0.75, fontSize: "1.05rem" }}>
        Aprende el oficio desde cero o perfecciona tu técnica con práctica
        real en la barbería.
      </p>

      <div className="panel mt-4">
        <h4>Temario</h4>
        {TEMARIO.map((t, i) => (
          <div className="service-row" key={t}>
            <span>
              <span style={{ color: "var(--gold)", marginRight: "0.8rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="service-row">
          <strong>Duración</strong>
          <span style={{ opacity: 0.75 }}>Por definir</span>
        </div>
        <div className="service-row">
          <strong>Modalidad</strong>
          <span style={{ opacity: 0.75 }}>Presencial</span>
        </div>
        <div className="service-row">
          <strong>Inversión</strong>
          <span className="service-price">Por definir</span>
        </div>
      </div>

      <Link
        to="/contacto"
        className="btn-login-dorado d-inline-block mt-4 text-decoration-none"
        style={{ padding: "0.8rem 1.6rem" }}
      >
        Quiero inscribirme
      </Link>
    </div>
  );
}