const WHATSAPP = "50200000000"; // <- pon tu número real

export default function Contacto() {
  return (
    <div className="container-narrow" style={{ paddingTop: "3rem" }}>
      <span className="eyebrow-tag">Contacto</span>
      <h2>Hablemos</h2>
      <p style={{ opacity: 0.7 }}>
        Escríbenos o visítanos. Respondemos lo antes posible.
      </p>

      <div className="panel">
        <div className="service-row">
          <strong>Dirección</strong>
          <span style={{ opacity: 0.75 }}>Tu dirección aquí</span>
        </div>
        <div className="service-row">
          <strong>Horario</strong>
          <span style={{ opacity: 0.75 }}>Lun a Sáb · 9:00 a.m. a 7:00 p.m.</span>
        </div>
        <div className="service-row">
          <strong>Teléfono</strong>
          <span style={{ opacity: 0.75 }}>+502 0000 0000</span>
        </div>
      </div>

    </div>
  );
}