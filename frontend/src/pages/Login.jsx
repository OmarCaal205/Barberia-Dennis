import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { iniciarSesion } from "../api.js";
import Logo from "../components/Logo.jsx";

const RECORDAR_KEY = "barberia_correo_recordado";

export default function Login({ onIniciarSesion }) {
  const [correo, setCorreo] = useState(
    () => localStorage.getItem(RECORDAR_KEY) || ""
  );
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(
    () => !!localStorage.getItem(RECORDAR_KEY)
  );
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [ahora, setAhora] = useState(new Date());
  const navegar = useNavigate();

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const fechaHoraTexto = new Intl.DateTimeFormat("es-GT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(ahora);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const data = await iniciarSesion({ correo, clave });

      if (recordar) localStorage.setItem(RECORDAR_KEY, correo);
      else localStorage.removeItem(RECORDAR_KEY);

      onIniciarSesion({
        id_usuario: data.id_usuario,
        rol: data.rol,
        nombre: data.nombre,
      });
      navegar("/");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-layout">
        {/* Columna de marca */}
        <section className="login-brand">
          <Logo size="lg" />
          <p className="login-fecha">{fechaHoraTexto}</p>
          <h1 className="login-marca">DennisBarberstudio</h1>
          <p className="login-tagline">
            Tu corte, decidido antes de sentarte en la silla.
          </p>

          <ul className="login-features">
            <li>
              <span className="login-dot" /> Agenda tu cita sin llamadas
            </li>
            <li>
              <span className="login-dot" /> Recomendación de estilo con IA
            </li>
            <li>
              <span className="login-dot" /> Sin citas encimadas
            </li>
          </ul>
        </section>

        {/* Tarjeta de acceso */}
        <section className="login-card">
          <h2 className="login-card-titulo">Iniciar sesión</h2>
          <p className="login-card-sub">Ingresa con tu cuenta para continuar</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={manejarEnvio}>
            <div className="field">
              <label htmlFor="correo">Correo</label>
              <div className="input-icon">
                <span className="input-icon-glyph">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <input
                  id="correo"
                  type="email"
                  className="form-control"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="clave">Contraseña</label>
              <div className="input-icon">
                <span className="input-icon-glyph">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="10" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <input
                  id="clave"
                  type={mostrarClave ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-toggle"
                  onClick={() => setMostrarClave((v) => !v)}
                >
                  {mostrarClave ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <label className="login-recordar">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
              />
              Recordarme
            </label>

            <button
              type="submit"
              className="btn-login-dorado w-100"
              disabled={cargando}
            >
              {cargando ? "Entrando..." : "Entrar →"}
            </button>
          </form>

          <p className="login-registro-link">
            ¿Primera vez aquí?{" "}
            <Link to="/registro" className="text-gold-link">
              Crea tu cuenta
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}