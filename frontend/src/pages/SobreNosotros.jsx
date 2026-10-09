export default function SobreNosotros() {
  return (
    <div className="about">
      <div>
        <span className="eyebrow-tag">Sobre nosotros</span>
        <h2>Más que una barbería, somos una comunidad</h2>
        <p style={{ opacity: 0.75 }}>
          Escribe aquí la historia de Denis Barber Studio: cuándo empezó, qué
          te motivó y qué hace diferente a tu barbería.
        </p>
        <div className="feat mt-3"><b>✂</b> Experiencia y profesionalismo</div>
        <div className="feat mt-3"><b>★</b> Ambiente cómodo y moderno</div>
        <div className="feat mt-3"><b>✦</b> Atención personalizada para cada cliente</div>
      </div>
      <img src="/dennis.jpg" alt="Dennis, fundador" />
    </div>
  );
}