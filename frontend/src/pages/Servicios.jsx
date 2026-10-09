import { Link } from "react-router-dom";

export default function Servicios() {
  // Lista de servicios actualizada con los nuevos precios y descripciones
  const serviciosLista = [
    {
      id: 1,
      titulo: "Corte de Cabello",
      desc: "Corte con asesoría personalizada, diseñado a tu medida.",
      precio: "Q65",
      img: "/img/corte-cabello.jpg", // Asegúrate de guardar tus fotos en public/img/
    },
    {
      id: 2,
      titulo: "Corte de Barba",
      desc: "Perfilado, rebajado y alineación impecable.",
      precio: "Q65",
      img: "/img/corte-barba.jpg",
    },
    {
      id: 3,
      titulo: "Corte de Cejas",
      desc: "Diseño y limpieza de cejas con navaja.",
      precio: "Q35",
      img: "/img/corte-cejas.jpg",
    },
    {
      id: 4,
      titulo: "Limpieza Facial",
      desc: "Limpieza profunda para un rostro fresco y sin impurezas.",
      precio: "Q65",
      img: "/img/limpieza-facial.jpg",
    },
    {
      id: 5,
      titulo: "Mascarillas",
      desc: "Tratamiento revitalizante premium para el cuidado de tu piel.",
      precio: "Q120",
      img: "/img/mascarillas.jpg",
    }
  ];

  return (
    <div className="container-wide" style={{ paddingTop: "3rem" }}>
      
      {/* BANNER PROMOCIONAL BASADO EN TU FLYER */}
      <div className="promo-banner">
        <div className="promo-content">
          <h2 className="promo-title">AHORA TU SERVICIO INCLUYE:</h2>
          <ul className="promo-list">
            <li>✂️ Corte con asesoría</li>
            <li>🧴 Lavado capilar</li>
            <li>💺 15 min. en silla masajeadora</li>
            <li>☕ Bebida de cortesía (Fría o Caliente)</li>
            <li>💳 <strong>Pago con tarjeta (Sin recargo)</strong></li>
          </ul>
          <div className="promo-price">
            POR <span>Q65.00</span>
          </div>
        </div>
      </div>

      <div className="servicios-header">
        <h2>Nuestros servicios</h2>
        <p>Elige el servicio, relájate y agenda tu cita.</p>
      </div>

      {/* CUADRÍCULA DE SERVICIOS CON FOTOS */}
      <div className="svc-grid-fotos">
        {serviciosLista.map((svc) => (
          <div key={svc.id} className="svc-card-foto">
            <div className="svc-img-wrapper">
              {/* Si la imagen no carga, mostrará este div gris temporalmente */}
              <img src={svc.img} alt={svc.titulo} className="svc-foto" loading="lazy" />
            </div>
            <div className="svc-body">
              <h4>{svc.titulo}</h4>
              <p>{svc.desc}</p>
              <div className="svc-foot">
                <span className="svc-price">{svc.precio}</span>
                <Link to="/agendar" className="btn-outline-barberia btn-sm">
                  Agendar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}